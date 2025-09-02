const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className=" border-t  mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className=" font-bold text-sm">D</span>
            </div>
            <span className=" font-medium">Dashboard App</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm ">
            <a href="#" className="">
              Privacy
            </a>
            <a href="#" className="">
              Terms
            </a>
            <a href="#" className="">
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <p className="text-center text-sm">
            © {currentYear} All rights reserved to Zubayer.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer