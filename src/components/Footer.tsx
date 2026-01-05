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
    <footer className="mt-16 py-8 px-6 bg-white/90 backdrop-blur-sm w-full">
      <div className="max-w-6xl mx-auto">
        {/* Three column grid - left/center/right aligned */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Resources - Left */}
          <div className="text-center md:text-left">
            <h4 className="font-body text-sm font-semibold text-foreground mb-3">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company - Center */}
          <div className="text-center">
            <h4 className="font-body text-sm font-semibold text-foreground mb-3">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal - Right */}
          <div className="text-center md:text-right">
            <h4 className="font-body text-sm font-semibold text-foreground mb-3">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section with logo left and copyright right */}
        <div className="pt-6 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-3">
          <img src={neylerLogo} alt="Neyler" className="h-5" loading="lazy" />
          <p className="font-body text-sm text-muted-foreground">© 2026 Neyler. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
