#!/usr/bin/env python3
"""
Systematic analysis of unsafe error property access patterns in catch blocks.
Analyzes all SvelteKit project files with catch blocks to find unsafe error.property access.
"""

import os
import re
import json
from typing import List, Dict, Any, Tuple
from pathlib import Path

class UnsafeErrorAnalyzer:
    def __init__(self, project_root: str):
        self.project_root = project_root
        self.files_to_analyze = [
            "src/routes/(auth)/login/+page.server.ts",
            "src/hooks.server.ts",
            "src/hooks.client.ts",
            "src/routes/(app)/listings/[id]/+page.svelte",
            "src/lib/components/listings/CreateListingForm/steps/ProductDetailsStep.svelte",
            "src/routes/api/orders/[id]/cancel/+server.ts",
            "src/routes/api/orders/[id]/+server.ts",
            "src/routes/api/orders/bulk/+server.ts",
            "src/routes/api/orders/[id]/complete/+server.ts",
            "src/routes/api/orders/[id]/ship/+server.ts",
            "src/routes/(auth)/callback/+page.server.ts",
            "src/routes/(auth)/register/+page.server.ts",
            "src/routes/(app)/onboarding/+page.server.ts",
            "src/routes/api/onboarding/complete/+server.ts",
            "src/lib/server/browse.ts",
            "src/routes/logout/+page.server.ts",
            "src/routes/api/admin/payouts/+server.ts",
            "src/routes/api/orders/[id]/refund/+server.ts",
            "src/routes/api/stripe/webhooks/+server.ts",
            "src/routes/api/payment/create-intent/+server.ts",
            "src/routes/api/health/stripe/+server.ts",
            "src/routes/(app)/listings/[id]/+page.server.ts",
            "src/lib/server/email.ts",
            "src/lib/components/listings/CreateListingForm/components/ImageUploader.svelte",
            "src/lib/utils/image-compression.ts",
            "src/lib/utils/format.ts",
            "src/routes/(auth)/register/+page.svelte",
            "src/lib/components/shared/UnifiedFilter.svelte",
            "src/lib/components/messaging/MessageSearch.svelte",
            "src/lib/components/messaging/ConversationListEnhanced.svelte",
            "src/lib/components/messaging/ConversationList.svelte",
            "src/lib/utils/storage.ts",
            "src/lib/utils/storage-client.ts",
            "src/lib/utils/error-handling.ts",
            "src/routes/api/orders/+server.ts",
            "src/lib/server/database-rate-limit.ts",
            "src/routes/(app)/admin/verify-emails/+page.server.ts",
            "src/lib/components/listings/CreateListingForm/CreateListingForm.svelte",
            "src/lib/components/brands/brand-onboarding-wizard/hooks/useImageUpload.svelte.ts",
            "src/lib/components/checkout/CheckoutFlow.svelte",
            "src/lib/components/onboarding/ProfileSetupWizard.svelte",
            "src/routes/(app)/browse/+page.svelte",
            "src/routes/(app)/orders/+page.svelte",
            "src/routes/brands/settings/+page.svelte",
            "src/lib/components/checkout/LazyCheckoutFlow.svelte",
            "src/lib/server/api-response.ts",
            "src/lib/components/checkout/checkout-modal/PaymentProcessor.svelte",
            "src/lib/components/shared/ErrorBoundary.svelte",
            "src/routes/api/upload/simple/+server.ts",
            "src/lib/components/layout/header/hooks/useNotifications.ts",
            "src/lib/components/brands/BrandOnboardingWizard.svelte",
            "src/lib/components/layout/MobileNav.svelte",
            "src/lib/components/home/TopSellersWithModal.svelte",
            "src/routes/api/health/db/+server.ts",
            "src/routes/(app)/messages/+page.server.ts",
            "src/routes/(auth)/login/+page.svelte",
            "src/routes/api/drafts/listing/+server.ts",
            "src/lib/components/layout/header/Header.svelte",
            "src/routes/api/orders/stats/+server.ts",
            "src/routes/api/orders/mark-shipped/+server.ts",
            "src/lib/components/orders/OrderDetails.svelte",
            "src/lib/components/ui/dialog/dialog.svelte",
            "src/routes/api/messages/conversations/+server.ts",
            "src/lib/components/auth/CaptchaWrapper.svelte",
            "src/lib/components/messaging/MessageThread.svelte",
            "src/lib/components/onboarding/UsernameSetup.svelte",
            "src/routes/api/admin/payouts/export/+server.ts",
            "src/routes/(app)/profile/settings/+page.svelte",
            "src/routes/api/admin/payouts/batch/+server.ts",
            "src/routes/(app)/profile/[username]/+page.svelte",
            "src/routes/(auth)/reset-password/+page.svelte",
            "src/routes/(auth)/forgot-password/+page.svelte",
            "src/routes/api/wishlist/+server.ts",
            "src/routes/api/views/+server.ts",
            "src/routes/api/upload/image/+server.ts",
            "src/routes/api/sellers/top/+server.ts",
            "src/routes/api/search/suggestions/+server.ts",
            "src/routes/api/payment/revolut/manual-payment/+server.ts",
            "src/routes/api/orders/export/+server.ts",
            "src/routes/api/metrics/+server.ts",
            "src/routes/api/messages/search/+server.ts",
            "src/routes/api/health/storage/+server.ts",
            "src/routes/api/filters/data/+server.ts",
            "src/routes/api/browse/load-more/+server.ts",
            "src/routes/api/auth/send-confirmation/+server.ts",
            "src/routes/api/auth/2fa/verify/+server.ts",
            "src/routes/api/auth/2fa/enable/+server.ts",
            "src/routes/api/auth/2fa/backup-codes/+server.ts",
            "src/routes/api/admin/payouts/stats/+server.ts",
            "src/routes/api/admin/create-first/+server.ts",
            "src/routes/(app)/wishlist/+page.svelte",
            "src/routes/(app)/sell/success/+page.svelte",
            "src/routes/(app)/sell/+page.server.ts",
            "src/routes/(app)/profile/+page.svelte",
            "src/routes/(app)/messages/[id]/+page.server.ts",
            "src/routes/(app)/browse/+page.server.ts",
            "src/lib/utils/webVitals.ts",
            "src/lib/utils/web-vitals.ts",
            "src/lib/utils/lazy-load.ts",
            "src/lib/utils/form-validation.ts",
            "src/lib/utils/api-client.ts",
            "src/lib/server/two-factor.ts",
            "src/lib/server/audit.ts",
            "src/lib/server/api-utils.ts",
            "src/lib/components/payment/PaymentAccountSetup.svelte",
            "src/lib/components/orders/ShippingForm.svelte",
            "src/lib/components/orders/OrderList.svelte",
            "src/lib/components/onboarding/AvatarPicker.svelte",
            "src/lib/components/listings/CreateListingForm/utils/validation.ts",
            "src/lib/components/listings/CreateListingForm/utils/image-processor.ts",
            "src/lib/components/listings/CreateListingForm/utils/draft-manager.ts",
            "src/lib/components/checkout/checkout-modal/hooks/useStripePayment.svelte.ts",
            "src/lib/components/checkout/checkout-modal/hooks/useRevolutPayment.svelte.ts",
            "src/lib/components/auth/TwoFactorVerification.svelte",
            "src/lib/components/auth/TwoFactorSetup.svelte",
            "src/routes/api/transactions/+server.ts",
            "src/routes/api/payment/account/setup/+server.ts",
            "src/routes/api/messages/unread-count/+server.ts",
            "src/routes/api/messages/send/+server.ts",
            "src/routes/api/messages/conversations/[id]/archive/+server.ts",
            "src/routes/api/health/all/+server.ts",
            "src/routes/api/categories/[id]/subcategories/+server.ts",
            "src/routes/api/auth/resend-verification/+server.ts",
            "src/routes/api/auth/2fa/disable/+server.ts",
            "src/routes/+layout.server.ts",
            "src/lib/utils/streaming.ts",
            "src/lib/utils/image-optimization.ts",
            "src/lib/utils/dynamic-imports.ts",
            "src/lib/stores/onboarding.svelte.ts",
            "src/lib/stores/messages.ts",
            "src/lib/stores/cookie-consent.svelte.ts",
            "src/lib/server/scheduled/cleanup-rate-limits.ts",
            "src/lib/server/qr-code.ts",
            "src/lib/server/auth-middleware.ts",
            "src/lib/hooks/useImagePreload.ts",
            "src/lib/components/listings/listing-card/useLikeToggle.svelte.ts",
            "src/lib/components/listings/CreateListingForm/FormContext.svelte.ts",
            "src/lib/actions/preload.ts",
            "src/lib/components/ui/LazyModal.svelte",
            "src/lib/components/auth/TwoFactorSettings.svelte"
        ]
        
        # Common error properties to look for
        self.error_properties = [
            'message', 'code', 'status', 'name', 'stack', 'details', 'data', 
            'statusCode', 'statusText', 'response', 'cause', 'error', 'type',
            'description', 'title', 'body', 'text'
        ]
        
        self.results = {
            'critical': [],  # Direct property access without type checking
            'high': [],      # Optional chaining but still unsafe
            'medium': [],    # Other patterns that might be unsafe
            'summary': {
                'total_files_analyzed': 0,
                'files_with_issues': 0,
                'total_unsafe_patterns': 0
            }
        }

    def read_file_content(self, file_path: str) -> str:
        """Read file content safely."""
        try:
            full_path = os.path.join(self.project_root, file_path)
            if not os.path.exists(full_path):
                print(f"Warning: File not found: {full_path}")
                return ""
            
            with open(full_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return ""

    def find_catch_blocks(self, content: str) -> List[Dict[str, Any]]:
        """Find all catch blocks in the content."""
        catch_blocks = []
        
        # Pattern to match catch statements with various parameter formats
        catch_pattern = r'catch\s*\(\s*([^)]*)\s*\)\s*\{'
        
        for match in re.finditer(catch_pattern, content, re.MULTILINE):
            start_pos = match.start()
            param = match.group(1).strip()
            
            # Find the matching closing brace
            brace_count = 1
            pos = match.end()
            block_end = pos
            
            while pos < len(content) and brace_count > 0:
                if content[pos] == '{':
                    brace_count += 1
                elif content[pos] == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        block_end = pos + 1
                        break
                pos += 1
            
            # Extract the catch block content
            block_content = content[match.end():block_end-1].strip()
            
            # Calculate line number
            line_num = content[:start_pos].count('\n') + 1
            
            catch_blocks.append({
                'line_number': line_num,
                'parameter': param,
                'content': block_content,
                'full_match': content[start_pos:block_end]
            })
        
        return catch_blocks

    def has_instanceof_check(self, catch_content: str, error_var: str) -> bool:
        """Check if there's proper instanceof Error checking before property access."""
        # Look for instanceof Error checks
        instanceof_patterns = [
            rf'{re.escape(error_var)}\s+instanceof\s+Error',
            rf'instanceof\s+Error.*{re.escape(error_var)}',
            rf'if\s*\(\s*{re.escape(error_var)}\s+instanceof\s+Error\s*\)',
            rf'{re.escape(error_var)}\s+instanceof\s+\w*Error',
            rf'isError\s*\(\s*{re.escape(error_var)}\s*\)',
            rf'isErrorLike\s*\(\s*{re.escape(error_var)}\s*\)'
        ]
        
        for pattern in instanceof_patterns:
            if re.search(pattern, catch_content, re.IGNORECASE):
                return True
        
        return False

    def find_unsafe_property_access(self, catch_content: str, error_var: str) -> List[Dict[str, Any]]:
        """Find unsafe error property access patterns in catch block."""
        unsafe_patterns = []
        
        if not error_var or error_var in ['', '_']:
            return unsafe_patterns
        
        # Check if there's proper type checking
        has_type_check = self.has_instanceof_check(catch_content, error_var)
        
        # Find all property accesses
        for prop in self.error_properties:
            # Direct property access: error.message
            direct_pattern = rf'{re.escape(error_var)}\.{prop}\b'
            direct_matches = list(re.finditer(direct_pattern, catch_content))
            
            # Optional chaining: error?.message  
            optional_pattern = rf'{re.escape(error_var)}\?\.{prop}\b'
            optional_matches = list(re.finditer(optional_pattern, catch_content))
            
            for match in direct_matches:
                # Get context around the match
                start = max(0, match.start() - 50)
                end = min(len(catch_content), match.end() + 50)
                context = catch_content[start:end].strip()
                
                severity = 'critical' if not has_type_check else 'medium'
                
                unsafe_patterns.append({
                    'type': 'direct_access',
                    'property': prop,
                    'pattern': match.group(0),
                    'context': context,
                    'severity': severity,
                    'has_type_check': has_type_check,
                    'position': match.start()
                })
            
            for match in optional_matches:
                # Get context around the match
                start = max(0, match.start() - 50)
                end = min(len(catch_content), match.end() + 50)
                context = catch_content[start:end].strip()
                
                severity = 'high' if not has_type_check else 'medium'
                
                unsafe_patterns.append({
                    'type': 'optional_chaining',
                    'property': prop,
                    'pattern': match.group(0),
                    'context': context,
                    'severity': severity,
                    'has_type_check': has_type_check,
                    'position': match.start()
                })
        
        return unsafe_patterns

    def extract_error_variable(self, param_string: str) -> str:
        """Extract the error variable name from catch parameter."""
        if not param_string:
            return ""
        
        # Handle different parameter formats:
        # catch (error)
        # catch (error: unknown)
        # catch (error: any)
        # catch (e)
        # catch ({ message })  // destructured - skip this
        
        if '{' in param_string:  # Skip destructured parameters
            return ""
        
        # Extract variable name before any type annotation
        var_match = re.match(r'([a-zA-Z_$][a-zA-Z0-9_$]*)', param_string.strip())
        if var_match:
            return var_match.group(1)
        
        return ""

    def analyze_file(self, file_path: str) -> Dict[str, Any]:
        """Analyze a single file for unsafe error property access."""
        content = self.read_file_content(file_path)
        if not content:
            return {'file_path': file_path, 'issues': [], 'catch_blocks_found': 0}
        
        catch_blocks = self.find_catch_blocks(content)
        file_issues = []
        
        for block in catch_blocks:
            error_var = self.extract_error_variable(block['parameter'])
            if not error_var:
                continue
            
            unsafe_patterns = self.find_unsafe_property_access(block['content'], error_var)
            
            for pattern in unsafe_patterns:
                issue = {
                    'file_path': os.path.join(self.project_root, file_path),
                    'line_number': block['line_number'],
                    'catch_parameter': block['parameter'],
                    'error_variable': error_var,
                    'unsafe_pattern': pattern,
                    'catch_context': block['content'][:200] + ('...' if len(block['content']) > 200 else '')
                }
                file_issues.append(issue)
                
                # Add to appropriate severity category
                self.results[pattern['severity']].append(issue)
        
        return {
            'file_path': file_path,
            'issues': file_issues,
            'catch_blocks_found': len(catch_blocks)
        }

    def analyze_all_files(self):
        """Analyze all files for unsafe error property access patterns."""
        print("Starting systematic analysis of unsafe error property access patterns...")
        print(f"Analyzing {len(self.files_to_analyze)} files...")
        
        files_with_issues = 0
        
        for i, file_path in enumerate(self.files_to_analyze, 1):
            print(f"[{i}/{len(self.files_to_analyze)}] Analyzing: {file_path}")
            
            result = self.analyze_file(file_path)
            self.results['summary']['total_files_analyzed'] += 1
            
            if result['issues']:
                files_with_issues += 1
                print(f"  X Found {len(result['issues'])} unsafe pattern(s)")
            else:
                print(f"  OK No unsafe patterns found ({result['catch_blocks_found']} catch blocks checked)")
        
        self.results['summary']['files_with_issues'] = files_with_issues
        self.results['summary']['total_unsafe_patterns'] = (
            len(self.results['critical']) + 
            len(self.results['high']) + 
            len(self.results['medium'])
        )

    def generate_report(self) -> str:
        """Generate a comprehensive analysis report."""
        report = []
        report.append("=" * 80)
        report.append("UNSAFE ERROR PROPERTY ACCESS ANALYSIS REPORT")
        report.append("=" * 80)
        report.append("")
        
        # Summary
        summary = self.results['summary']
        report.append("SUMMARY:")
        report.append(f"  Total files analyzed: {summary['total_files_analyzed']}")
        report.append(f"  Files with unsafe patterns: {summary['files_with_issues']}")
        report.append(f"  Total unsafe patterns found: {summary['total_unsafe_patterns']}")
        report.append(f"    - Critical: {len(self.results['critical'])}")
        report.append(f"    - High: {len(self.results['high'])}")
        report.append(f"    - Medium: {len(self.results['medium'])}")
        report.append("")
        
        # Detailed findings by severity
        for severity in ['critical', 'high', 'medium']:
            if not self.results[severity]:
                continue
                
            report.append("=" * 80)
            report.append(f"{severity.upper()} SEVERITY ISSUES ({len(self.results[severity])} found)")
            report.append("=" * 80)
            report.append("")
            
            for issue in self.results[severity]:
                report.append(f"File: {issue['file_path']}")
                report.append(f"Line: {issue['line_number']}")
                report.append(f"Catch parameter: {issue['catch_parameter']}")
                report.append(f"Error variable: {issue['error_variable']}")
                report.append(f"Unsafe pattern: {issue['unsafe_pattern']['pattern']}")
                report.append(f"Property accessed: {issue['unsafe_pattern']['property']}")
                report.append(f"Access type: {issue['unsafe_pattern']['type']}")
                report.append(f"Has type check: {issue['unsafe_pattern']['has_type_check']}")
                report.append("")
                report.append("Context:")
                report.append(f"  {issue['unsafe_pattern']['context']}")
                report.append("")
                report.append("Catch block context:")
                report.append(f"  {issue['catch_context']}")
                report.append("")
                report.append("-" * 80)
                report.append("")
        
        return "\n".join(report)

    def save_results(self, output_file: str):
        """Save detailed results to JSON file."""
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, default=str)

def main():
    project_root = "K:\\driplo.bg-main"
    analyzer = UnsafeErrorAnalyzer(project_root)
    
    # Run the analysis
    analyzer.analyze_all_files()
    
    # Generate and save report
    report = analyzer.generate_report()
    
    # Save text report
    with open(os.path.join(project_root, "UNSAFE_ERROR_ACCESS_REPORT.md"), 'w', encoding='utf-8') as f:
        f.write(report)
    
    # Save JSON results
    analyzer.save_results(os.path.join(project_root, "unsafe_error_access_results.json"))
    
    print("")
    print("=" * 80)
    print("ANALYSIS COMPLETE!")
    print("=" * 80)
    print(f"Report saved to: UNSAFE_ERROR_ACCESS_REPORT.md")
    print(f"Detailed results saved to: unsafe_error_access_results.json")
    print("")
    print("SUMMARY:")
    print(f"  Total files analyzed: {analyzer.results['summary']['total_files_analyzed']}")
    print(f"  Files with issues: {analyzer.results['summary']['files_with_issues']}")
    print(f"  Total unsafe patterns: {analyzer.results['summary']['total_unsafe_patterns']}")
    print(f"    Critical: {len(analyzer.results['critical'])}")
    print(f"    High: {len(analyzer.results['high'])}")
    print(f"    Medium: {len(analyzer.results['medium'])}")

if __name__ == "__main__":
    main()