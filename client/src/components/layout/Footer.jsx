/**
 * Footer component
 * @returns {JSX.Element}
 */
export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Built with ❤️ — Fetish App
          </p>
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Fetish App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
