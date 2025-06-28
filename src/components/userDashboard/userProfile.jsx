import React from "react";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="container">
      <h3 className="mb-4">👤 My Profile</h3>

      <div className="card shadow-sm p-4">
        <div className="row">
          <div className="col-md-4 text-center">
            <img
              src={user.profilePic || "/images/userpic.png"}
              alt="Profile"
              className="rounded-circle img-fluid mb-3"
              style={{ maxWidth: "150px" }}
            />
          </div>

          <div className="col-md-8">
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <th>Name:</th>
                  <td>{user.name}</td>
                </tr>
                <tr>
                  <th>Email:</th>
                  <td>{user.email}</td>
                </tr>
                {user.phone && (
                  <tr>
                    <th>Phone:</th>
                    <td>{user.phone}</td>
                  </tr>
                )}
                <tr>
                  <th>Role:</th>
                  <td className="text-capitalize">{user.role}</td>
                </tr>
                
                {user.createdAt && (
                  <tr>
                    <th>Joined:</th>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
