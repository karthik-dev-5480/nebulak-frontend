"use client";
import { useState, useEffect } from "react";

// --- Interfaces ---
interface User {
  id: number;
  displayName: string;
}

interface Role {
  id: number;
  name: string;
  level: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AddRoleForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState(1); 
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const roleData = {
      name: name,
      description: description,
      level: level,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/auth/role/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create role on the server.");
      }

      const result = await response.json(); 
      console.log("Role created successfully:", result);
      alert(`Role '${result.name}' added successfully!`);

      // Reset form
      setName("");
      setDescription("");
      setLevel(1);
      
    } catch (error: any) {
      console.error("Error creating role:", error.message);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="w-full max-w-[500px] rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-900">
      <h2 className="mb-6 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
        Add New Role 🚀
      </h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Role Name & Level */}
       <div className="flex gap-4">
            
            {/* Role Name (Takes up more space) */}
            <div className="flex-grow">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role Name
              </label>
              <input
                type="text"
                placeholder="e.g., Engineer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                // ADJUSTED: py-2.5 for consistent height
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            {/* Role Level Number Input (Takes up less space) */}
            <div className="w-1/3 min-w-[120px]">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Level 
              </label>
              <input
                type="number"
                placeholder="1"
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
        </div>
     
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            rows={1} // Keep it a single line high visually, but semantically a textarea
            placeholder="What are the responsibilities of this role?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            required
          ></textarea>
        </div>

       

        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
        >
          Create Role
        </button>
      </form>
    </div>
  );
};

const RoleManagementView = () => {
  // State to hold fetched data
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  
  // State for form selections
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- Data Fetching Logic ---
  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Users (Employees)
        const userResponse = await fetch(`${API_BASE_URL}/auth/users/getallusers`); 
        if (!userResponse.ok) throw new Error("Failed to fetch users.");
        const result = await userResponse.json(); 
    const userData: User[] = result.content || [];
        setUsers(userData);
        if (userData.length > 0) {
          setSelectedUserId(userData[0].id); // Select first user by default
        }

        // 2. Fetch Roles
        const roleResponse = await fetch(`${API_BASE_URL}/auth/roles/getallroles`);
        if (!roleResponse.ok) throw new Error("Failed to fetch roles.");
        const roleData: Role[] = await roleResponse.json();
        setRoles(roleData);
        if (roleData.length > 0) {
          setSelectedRoleId(roleData[0].id); // Select first role by default
        }

      } catch (error: any) {
        console.error("Error fetching data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersAndRoles();
  }, []); // Run only once on component mount

  const handleAssignRoleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();

    if (selectedUserId === null || selectedRoleId === null) {
        alert("Please select both a User and a Role.");
        return;
    }

    const assignmentData = {
      userId: selectedUserId,
      roleId: selectedRoleId,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/assignrole`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Assuming you need Authorization header for this protected endpoint:
          // "Authorization": `Bearer ${yourJwtToken}` 
        },
        body: JSON.stringify(assignmentData),
      });

      if (!response.ok) {
        // Read error response text for alert/console
        const errorText = await response.text();
        throw new Error(errorText || "Failed to assign role on the server.");
      }

      // 🚀 FIX APPLIED: Read the success response as plain text
      const resultText = await response.text(); 
      console.log("Role assigned successfully. Server response:", resultText);
      
      // Look up user/role names for a friendly confirmation message
      const assignedUser = users.find(u => u.id === selectedUserId);
      const assignedRole = roles.find(r => r.id === selectedRoleId);

      // Display a friendly success message using the names
      alert(`✅ Success: Assigned role '${assignedRole?.name || selectedRoleId}' to user '${assignedUser?.displayName || selectedUserId}'!`);
      
      // Optionally: Reset form fields or refresh the user list here
      // setSelectedUserId(null);
      // setSelectedRoleId(null);
      
    } catch (error: any) {
      console.error("Error assigning role:", error.message);
      // The error message already contains the server's helpful message
      alert("Error: " + error.message);
    }
  };
   

  if (isLoading) {
    return (
      <section id="role-management" className="pt-16 pb-10 md:pt-20 lg:pt-28">
        <div className="container">
          <div className="flex justify-center">
            <div className="w-full max-w-[500px] rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-900">
              <p className="text-center text-lg text-black dark:text-white">
                Loading users and roles...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="role-management" className="pt-16 pb-10 md:pt-20 lg:pt-28">
      <div className="container mx-auto flex flex-wrap justify-center gap-10">
        
        <AddRoleForm />

        <div className="w-full max-w-[500px] rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-900">
          <h2 className="mb-6 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
            Assign Role to Employee 🤝
          </h2>

          <form className="space-y-5" onSubmit={handleAssignRoleSubmit}>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Employee (User)
              </label>
              <select
                value={selectedUserId ?? ""}
                onChange={(e) => setSelectedUserId(parseInt(e.target.value, 10))}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              >
                {users.length === 0 && <option value="" disabled>No employees available</option>}
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Role
              </label>
              <select
                value={selectedRoleId ?? ""}
                onChange={(e) => setSelectedRoleId(parseInt(e.target.value, 10))}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              >
                {roles.length === 0 && <option value="" disabled>No roles available</option>}
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name} (Level: {role.level})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Assign Role
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RoleManagementView;