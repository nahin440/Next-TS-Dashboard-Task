'use client'

interface PaginationProps {
  usersPerPage: number
  totalUsers: number
  currentPage: number
  paginate: (pageNumber: number) => void
}

const Pagination = ({ usersPerPage, totalUsers, currentPage, paginate }: PaginationProps) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i)
  }

  if (pageNumbers.length <= 1) return null

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center space-x-2">
        <button
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-md bg-card text-card-foreground disabled:opacity-50 disabled:cursor-not-allowed border border-border shadow-sm hover:bg-muted transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 rounded-md border border-border shadow-sm transition-all ${
              currentPage === number
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium'
                : 'bg-card text-card-foreground hover:bg-muted'
            }`}
          >
            {number}
          </button>
        ))}
        
        <button
          onClick={() => currentPage < pageNumbers.length && paginate(currentPage + 1)}
          disabled={currentPage === pageNumbers.length}
          className="px-3 py-2 rounded-md bg-card text-card-foreground disabled:opacity-50 disabled:cursor-not-allowed border border-border shadow-sm hover:bg-muted transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  )
}

export default Pagination