import Link from 'next/link'
import UserCard from './UserCard'

interface User {
  id: number
  name: string
  email: string
  phone: string
  website: string
}

interface UserListProps {
  users: User[]
}

const UserList = ({ users }: UserListProps) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-xl mb-4">No users found</div>
        <p className="text-muted-foreground/70">Try adjusting your search criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 perspective-1000">
      {users.map((user, index) => (
        <div 
          key={user.id} 
          className="transition-3d transform-style-3d"
          style={{ transitionDelay: `${index * 0.1}s` }}
        >
          <Link href={`/users/${user.id}`}>
            <UserCard user={user} />
          </Link>
        </div>
      ))}
    </div>
  )
}

export default UserList