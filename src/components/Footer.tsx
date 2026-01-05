import { Link } from "react-router-dom";
import neylerLogo from "@/assets/neyler-logo.png";

const productLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Goals", path: "/goals" },
  { name: "Habits & Tasks", path: "/dashboard" },
  { name: "Journal", path: "/journal" },
  { name: "Tutorials", path: "/tutorials" },
];

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
    <footer className="py-12 px-4 border-t border-border/30 bg-gradient-to-b from-transparent to-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Four column grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Product */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.path + link.name}>
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

          {/* Resources */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">Resources</h4>
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
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">Company</h4>
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
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">Legal</h4>
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

        {/* Bottom section with logo and copyright */}
        <div className="pt-8 border-t border-border/30 flex flex-col items-center gap-4">
          <img src={neylerLogo} alt="Neyler" className="h-6" loading="lazy" />
          <p className="text-sm text-muted-foreground">© 2025 Neyler. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
