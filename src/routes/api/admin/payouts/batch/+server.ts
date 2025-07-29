import type { RequestHandler } from './$types';
import { 
  apiError, 
  apiSuccess, 
  requireAdmin, 
  parseRequestBody,
  validateUUID,
  handleDatabaseError 
} from '$lib/server/api-utils';
import { logAdminAction, AdminActions, ResourceTypes } from '$lib/server/audit';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    // Require admin authentication
    const auth = await requireAdmin(locals);
    if (!auth) {
      return apiError('Admin access required', 403);
    }

    // Parse request body
    const body = await parseRequestBody<{ 
      payout_ids: string[]; 
      action: 'approve' | 'reject';
      notes?: string;
    }>(request);

    const { payout_ids, action, notes } = body;

    // Validate inputs
    if (!payout_ids || !Array.isArray(payout_ids) || payout_ids.length === 0) {
      return apiError('Invalid payout IDs', 400);
    }

    if (payout_ids.length > 50) {
      return apiError('Cannot process more than 50 payouts at once', 400);
    }

    // Validate all IDs are valid UUIDs
    for (const id of payout_ids) {
      if (!validateUUID(id)) {
        return apiError(`Invalid payout ID: ${id}`, 400);
      }
    }

    if (!action || !['approve', 'reject'].includes(action)) {
      return apiError('Invalid action. Must be "approve" or "reject"', 400);
    }

    const userId = auth.userId;
    const results = {
      successful: [] as string[],
      failed: [] as { id: string; error: string }[]
    };

    // Process payouts in batches for better performance
    if (action === 'approve') {
      // Update all payouts at once
      const { data: updatedPayouts, error: payoutError } = await locals.supabase
        .from('seller_payouts')
        .update({
          status: 'completed',
          processed_by: userId,
          processed_at: new Date().toISOString(),
          admin_notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .in('id', payout_ids)
        .eq('status', 'processing') // Only update if status is processing
        .select();

      if (payoutError) {
        handleDatabaseError(payoutError);
        return apiError('Failed to update payouts: ' + payoutError.message, 500);
      }

      const updatedPayoutIds = updatedPayouts?.map(p => p.id) || [];
      const failedPayoutIds = payout_ids.filter(id => !updatedPayoutIds.includes(id));

      // Update transaction payout status for all successful payouts
      if (updatedPayouts && updatedPayouts.length > 0) {
        const transactionIds = updatedPayouts.map(p => p.transaction_id);
        await locals.supabase
          .from('transactions')
          .update({
            seller_payout_status: 'completed',
            payout_processed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .in('id', transactionIds);

        // Log admin actions in batch
        const logPromises = updatedPayouts.map(payout => 
          logAdminAction(locals.supabase, {
            action: AdminActions.PAYOUT_APPROVE,
            resourceType: ResourceTypes.PAYOUT,
            resourceId: payout.id,
            details: {
              amount: payout.amount,
              seller_id: payout.seller_id,
              transaction_id: payout.transaction_id,
              notes,
              batch_operation: true
            }
          })
        );
        await Promise.all(logPromises);
      }

      results.successful = updatedPayoutIds;
      results.failed = failedPayoutIds.map(id => ({ 
        id, 
        error: 'Payout not found or not in processing status' 
      }));

    } else if (action === 'reject') {
      // Update all payouts to failed status at once
      const { data: updatedPayouts, error: payoutError } = await locals.supabase
        .from('seller_payouts')
        .update({
          status: 'failed',
          processed_by: userId,
          processed_at: new Date().toISOString(),
          admin_notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .in('id', payout_ids)
        .eq('status', 'processing') // Only update if status is processing
        .select();

      if (payoutError) {
        handleDatabaseError(payoutError);
        return apiError('Failed to update payouts: ' + payoutError.message, 500);
      }

      const updatedPayoutIds = updatedPayouts?.map(p => p.id) || [];
      const failedPayoutIds = payout_ids.filter(id => !updatedPayoutIds.includes(id));

      // Update transaction payout status for all rejected payouts
      if (updatedPayouts && updatedPayouts.length > 0) {
        const transactionIds = updatedPayouts.map(p => p.transaction_id);
        await locals.supabase
          .from('transactions')
          .update({
            seller_payout_status: 'failed',
            updated_at: new Date().toISOString()
          })
          .in('id', transactionIds);

        // Log admin actions in batch
        const logPromises = updatedPayouts.map(payout => 
          logAdminAction(locals.supabase, {
            action: AdminActions.PAYOUT_REJECT,
            resourceType: ResourceTypes.PAYOUT,
            resourceId: payout.id,
            details: {
              amount: payout.amount,
              seller_id: payout.seller_id,
              transaction_id: payout.transaction_id,
              notes,
              batch_operation: true
            }
          })
        );
        await Promise.all(logPromises);
      }

      results.successful = updatedPayoutIds;
      results.failed = failedPayoutIds.map(id => ({ 
        id, 
        error: 'Payout not found or not in processing status' 
      }));
    }

    const totalProcessed = results.successful.length;
    const totalFailed = results.failed.length;

    return apiSuccess({
      message: `Batch ${action} completed: ${totalProcessed} successful, ${totalFailed} failed`,
      results,
      summary: {
        total: payout_ids.length,
        successful: totalProcessed,
        failed: totalFailed
      }
    });

  } catch (error) {
    console.error('Batch payout processing error:', error);
    return apiError('Failed to process batch payouts', 500);
  }
};