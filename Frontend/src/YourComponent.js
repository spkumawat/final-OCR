import React, { useEffect, useState } from "react";
import './YourComponent.css';
import {Link ,redirect} from 'react-router-dom'
const YourComponent = () => {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    _id:"",
    identification_number: "",
    name: "",
    last_name: "",
    date_of_birth: "",
    date_of_issue: "",
    date_of_expiry: "",
  });

  useEffect(() => {
    const fetchIds = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/extract/getIds"
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("There was a problem fetching the data:", error);
      }
    };

    fetchIds();
  }, [formData,data]);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/extract/delete/${id}`, {
        method: "DELETE",
      });
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const handleUpdate = async (id,e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/api/extract/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
        
      });
      // You may want to re-fetch the updated data or update the local state as needed
    } catch (error) {
      console.error("Error updating entry:", error);
    }
    setFormData({
      _id:"",
      identification_number: "",
      name: "",
      last_name: "",
      date_of_birth: "",
      date_of_issue: "",
      date_of_expiry: "",
    })
  };

  const handleChange = (e, key) => {
    setFormData({ ...formData, [key]: e.target.value });
  };
  const openUpdate = async (item) => {
    formData._id=item._id
    formData.identification_number=item.identification_number
    formData.name= item.name
    formData.last_name=item.last_name
    formData.date_of_birth = item.date_of_birth
    formData.date_of_issue= item.date_of_issue
    formData.date_of_expiry= item.date_of_expiry
    window.scrollTo({
      top: 10000,
      behavior: "smooth"
    })
  }
  return (
    <>
     <Link  className="extract-info-btn" to="/" style={{
      display:"block"
     }}>Back</Link>
    <div className="main-container">
      {data?.map((item, index) => {
        return (
          <div key={index} className="data-container">
            <h1>{item.identification_number}</h1>
            <h1>{item.name}</h1>
            <h1>{item.last_name}</h1>
            <h1>{item.date_of_birth}</h1>
            <h1>{item.date_of_issue}</h1>
            <h1>{item.date_of_expiry}</h1>
            <div className="button-group">
              <button className="delete-button" onClick={() => handleDelete(item._id)}>Delete</button>
              <button className="update-button" onClick={() => openUpdate(item)}>Update</button>
            </div>
          </div>
        );
      })}
         </div>
      <div className="form-div">
        <form onSubmit={(e) => handleUpdate(formData._id,e)}>
          <input
            type="text"
            placeholder="Identification Number"
            value={formData.identification_number}
            onChange={(e) => handleChange(e, "identification_number")}
          />
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => handleChange(e, "name")}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) => handleChange(e, "last_name")}
          />
          <input
            type="text"
            placeholder="Date of Birth"
            value={formData.date_of_birth}
            onChange={(e) => handleChange(e, "date_of_birth")}
          />
          <input
            type="text"
            placeholder="Date of Issue"
            value={formData.date_of_issue}
            onChange={(e) => handleChange(e, "date_of_issue")}
          />
          <input
            type="text"
            placeholder="Date of Expiry"
            value={formData.date_of_expiry}
            onChange={(e) => handleChange(e, "date_of_expiry")}
          />
          <button className="submit-button">Update</button>
        </form>
      </div>
      </>
  );
    }
export default YourComponent;
