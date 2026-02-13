import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-bold text-white">MerchStore</span>
            </div>
            <p className="text-gray-400">
              Create custom merchandise with ease.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-white font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="hover:text-purple-400 transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/designs"
                  className="hover:text-purple-400 transition-colors"
                >
                  Designs
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-purple-400 transition-colors"
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="hover:text-purple-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-purple-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="hover:text-purple-400 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-purple-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-400 text-sm">
          © 2025 MerchStore. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
