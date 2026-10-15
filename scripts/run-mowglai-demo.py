import sys
import pathlib
import json

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

app_dir = pathlib.Path(r"C:\Users\18\OneDrive\Desktop\DukaanMitra-OS\apps\ai-services")
sys.path.insert(0, str(app_dir))

from mowglai_delivery_agent import MowglaiDeliveryService, ClientBriefIn

def run_demo():
    print("=" * 65)
    print("[Mowglai Website Delivery Agent v0.1] - Client Delivery Run")
    print("=" * 65)

    brief = ClientBriefIn(
        project_id="client_sharma_sweets_jaipur",
        business_name="Sharma Sweets & Kirana Superstore",
        business_type="sweet-shop",
        owner_name="Amit Sharma",
        phone="+919876543210",
        email="orders@sharmasweets.in",
        location="Civil Lines, Jaipur, Rajasthan",
        pages=["home", "services", "about", "contact"],
        brand_primary_color="#d97706",
        brand_accent_color="#b45309"
    )

    print("\n[Step 1] Client Brief Intake & Schema Validation:")
    b_res = MowglaiDeliveryService.create_project_brief(brief)
    print(f"  + Brief accepted for: {b_res['business_name']}")
    print(f"  + Project ID: {b_res['project_id']}")
    print(f"  + Phone: {b_res['phone']} | Location: {b_res['location']}")

    print("\n[Step 2] AI Planning & Sitemap Generation:")
    plan = MowglaiDeliveryService.generate_ai_plan(b_res["project_id"])
    print(f"  + Plan status: {plan['status']}")
    print(f"  + Sitemap generated with {len(plan['sitemap'])} pages:")
    for p in plan['sitemap']:
        print(f"     - Page '{p['id']}': {p['title']} (SEO: {p['seo']['title']})")

    print("\n[Step 3] Sandboxed Code Generation (HTML5/CSS/JS):")
    build = MowglaiDeliveryService.build_sandboxed_site(b_res["project_id"])
    print(f"  + Build Status: {build['status']}")
    print(f"  + Generated artifacts: {build['output_files']}")
    print(f"  + Preview route: {build['preview_url']}")

    print("\n[Step 4] Automated QA Verification (5 Quality Gates):")
    qa = MowglaiDeliveryService.run_qa_report(b_res["project_id"])
    print(f"  + Overall QA: {'PASSED' if qa['passed'] else 'FAILED'} (Score: {qa['score']})")
    for c in qa['checks']:
        icon = "[PASS]" if c['passed'] else "[FAIL]"
        print(f"     {icon} {c['check']}: {c['description']}")

    print("\n[Step 5] Human Approval Gate & Delivery Sign-off:")
    appr = MowglaiDeliveryService.approve_and_handover(
        b_res["project_id"],
        approver_name="Amit Sharma",
        approver_role="Shop Owner & Managing Director"
    )
    print(f"  + Approval status: {appr['status']}")
    print(f"  + Certificate ID: {appr['certificate_id']}")
    print(f"  + Approved At: {appr['approved_at']}")
    print(f"  + Handover Preview: {appr['handover_url']}")

    print("\n" + "=" * 65)
    print("SUCCESS: CLIENT DELIVERY PIPELINE COMPLETED 100%!")
    print("=" * 65)

if __name__ == "__main__":
    run_demo()
