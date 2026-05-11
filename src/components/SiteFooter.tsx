import { Link } from "@tanstack/react-router";
import { Leaf, Mail, MapPin } from "lucide-react";
import logo from "@/assets/e-waste-logo.png";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={logo} alt="e-waste ready" className="h-14 w-auto bg-cream rounded-xl p-2" />
          <p className="mt-4 max-w-sm text-primary-foreground/80 text-sm leading-relaxed">
            Empowering Filipinos to dispose of electronic waste responsibly through information,
            collection drives, and policy awareness.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/" className="hover:text-accent">Home</Link></li>
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/services" className="hover:text-accent">Services</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4">Reach us</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Philippines</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@ewasteready.ph</li>
            <li className="flex items-center gap-2"><Leaf className="h-4 w-4" /> Sustainable since 2024</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} e-waste ready · Responsible electronics for a greener Philippines
      </div>
    </footer>
  );
}
