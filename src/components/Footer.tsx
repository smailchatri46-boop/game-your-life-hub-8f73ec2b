import { Link } from "react-router-dom";
import neylerLogo from "@/assets/neyler-logo.png";

const resourceLinks = [
  { name: "Pricing", path: "/pricing" },
  { name: "FAQ", path: "/faq" },
];

const companyLinks = [
  { name: "About Neyler", path: "/about" },
  { name: "Contact Us", path: "/contact" },
];

const legalLinks = [
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Terms of Service", path: "/terms" },
  { name: "Cookie Policy", path: "/cookies" },
  { name: "Refund Policy", path: "/refund" },
];

export function Footer() {
  return (
    <footer className="mt-16 py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Three column grid */}
        <div className="grid grid-cols-3 gap-8 mb-10">
          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section with logo left and copyright right */}
        <div className="pt-8 flex items-center justify-between">
          <img src={neylerLogo} alt="Neyler" className="h-6" loading="lazy" />
          <p className="text-sm text-muted-foreground">© 2026 Neyler. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
