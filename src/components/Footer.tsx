import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
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

const AFFILIATE_SIGNUP_URL = "https://neylercom-7c64.endorsely.com/";
const EARN_PER_VIEWS_URL = "https://forms.gle/ekE542XjQjcAx2NFA";

export function Footer() {
  return (
    <footer className="mt-16 py-8 px-6 bg-white/90 backdrop-blur-sm w-full">
      <div className="max-w-6xl mx-auto">
        {/* Three column layout with space-between */}
        <div className="flex flex-col md:flex-row md:justify-between gap-8 mb-8">
          {/* Resources - Left */}
          <div className="text-center flex-1">
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
          <div className="text-center flex-1">
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
          <div className="text-center flex-1">
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

        {/* Bottom section with logo left, partner links center, and copyright right */}
        <div className="pt-6 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-3">
          <img src={neylerLogo} alt="Neyler" className="h-5" loading="lazy" decoding="async" width={71} height={20} />
          
          <div className="flex items-center gap-4">
            <a
              href={AFFILIATE_SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 font-medium"
            >
              Become an Affiliate
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-muted-foreground/40">•</span>
            <a
              href={EARN_PER_VIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 font-medium"
            >
              Earn Per 1K Views
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          
          <p className="font-body text-xs text-muted-foreground/60">© 2026 Neyler. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
