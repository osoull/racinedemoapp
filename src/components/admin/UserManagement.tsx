interface UserManagementProps {
  filter?: string;
}

export default function UserManagement({ filter }: UserManagementProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">إدارة المستخدمين</h2>
      <div className="grid gap-4">
        {filter === "investor" && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">المستثمرون</h3>
            {/* Investor management content */}
          </div>
        )}
        
        {filter === "project_owner" && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">أصحاب المشاريع</h3>
            {/* Project owner management content */}
          </div>
        )}
        
        {!filter && (
          <>
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">المستثمرون</h3>
              {/* All investors list */}
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">أصحاب المشاريع</h3>
              {/* All project owners list */}
            </div>
          </>
        )}
      </div>
    </div>
  )
}