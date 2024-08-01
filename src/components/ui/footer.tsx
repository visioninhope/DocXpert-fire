import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <div>
            <h3 className="text-xl font-bold mb-4 hover:text-green-500 hover:underline transition-colors duration-300 ">DocXpert</h3>
            <p className="text-sm hover:text-green-500  ">Your AI-powered document assistant</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 hover:text-green-500 hover:underline transition-colors duration-300 ">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/" className="hover:text-green-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-green-500 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-green-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contactus" className="hover:text-green-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 hover:text-green-500 hover:underline transition-colors duration-300 ">Connect</h4>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 hover:text-green-500 hover:underline transition-colors duration-300 ">Newsletter</h4>
            <p className="text-sm mb-4 hover:text-green-500 transition-colors">
              Stay updated with our latest features and news
            </p>
            <form className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-700 text-white px-4 py-2 rounded-t-md sm:rounded-l-md sm:rounded-r-none focus:outline-none mb-2 sm:mb-0"
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-b-md sm:rounded-r-md sm:rounded-l-none hover:bg-green-600 focus:outline-none transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
          <p className="hover:text-green-500 transition-colors">
            © {new Date().getFullYear()} DocXpert. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;