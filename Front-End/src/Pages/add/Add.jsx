import "./Add.scss";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { getAuthUser } from "../../localStorage/storage";

const Add = () => {

  const freelancer = getAuthUser();

  const [service, setService] = useState({
    err: null,
    loading: false,
    serviceTitle: "",
    serviceDesc: "",
    serviceCategoryId: "",
    serviceShortTitle: "",
    serviceShortDesc: "",
    servicePrice: "",
    freelancerId: freelancer._id,
    revisionNumber: "",
    deliveryTime: "",
    coverImage: "",
    features: [],
    images: [],
  });

  const navigate = useNavigate();

  // const addFeature = () => {

  // }

  const [categories, setCategories] = useState({
    loading: true,
    results: null,
    err: null,
    status: null,
    name: "",
    desc: "",
    reload: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/categories/getAllCategories")
      .then((resp) => {
        setCategories({ results: resp.data, loading: false, err: null });
      })
      .catch((err) => {
        console.log(err);
        // setConversation({ ...conversation, loading: false, err: err.response.data.errors });
      });
  }, [categories.reload]);

  const images = useRef(null);

  const coverImage = useRef(null);

  const uploadImages = (id) => {

    const formData = new FormData();
    // formData.append("images", images.current.files[0]);

    for (let i = 0; i < images.current.files.length; i++) {
      formData.append("images", images.current.files[i]);
    }

    axios
      .put("http://localhost:3000/api/services/uploadImages/" + id, formData)
      .then((resp) => {
        // image.current.value = null;
        // swal(resp.data.message, "", "success");
        console.log(resp);
        // window.location.replace("http://localhost:3001/gigs");
      })
      .catch((errors) => {
        // swal(errors.response.data.message, "", "error");
        console.log(errors);
        // console.log(errors.response.data.message);
      });
  }


  const uploadCoverImage = (id) => {

    const formData = new FormData();
    formData.append("coverImage", coverImage.current.files[0]);

    // for (let i = 0; i < coverImage.current.files.length; i++) {
    //   formData.append("images", coverImage.current.files[i]);
    // }

    axios
      .put("http://localhost:3000/api/services/uploadCoverImage/" + id, formData)
      .then((resp) => {
        // image.current.value = null;
        // swal(resp.data.message, "", "success");
        console.log(resp);
      })
      .catch((errors) => {
        // swal(errors.response.data.message, "", "error");
        console.log(errors);
        // console.log(errors.response.data.message);
      });
  }

  var [featureList, setFeatureList] = useState([{ feature: "" }]);
  console.log(featureList);

  const handleFeaturesChange = (e, index) => {
    const { name, value } = e.target;
    var list = [...featureList];
    list[index][name] = value;
    setFeatureList(list);
  };

  const handleFeaturesArray = () => {

    var array = [];

    featureList.forEach((item) => {
      array.push(item.feature);
    });

    return array;

  };

  const handleFeaturesRemove = (index) => {
    const list = [...featureList];
    list.splice(index, 1);
    setFeatureList(list);
  };

  const handleFeaturesAdd = () => {
    setFeatureList([...featureList, { feature: "" }]);
  };


  const addServiceData = async (e) => {
    e.preventDefault();

    handleFeaturesArray();

    setService({ ...service, loading: true, err: null });
    // const formData = new FormData();
    // formData.append("images", images.current.files[0]);
    // formData.append("cover_image", cover_image.current.files[0]);

    axios
      .post("http://localhost:3000/api/services/createService", {
        serviceTitle: service.serviceTitle,
        serviceShortTitle: service.serviceShortTitle,
        serviceShortDesc: service.serviceShortDesc,
        serviceDesc: service.serviceDesc,
        serviceCategoryId: service.serviceCategoryId,
        servicePrice: service.servicePrice,
        freelancerId: service.freelancerId,
        deliveryTime: service.deliveryTime,
        revisionNumber: service.revisionNumber,
        features: handleFeaturesArray()
      })
      .then((resp) => {
        const serviceId = resp.data.newService._id;
        console.log(images.current);
        console.log(coverImage.current);
        uploadCoverImage(serviceId);
        uploadImages(serviceId);
        document.getElementById("serviceFrom").reset();
        document.getElementById("service").value = "";
        let list = document.querySelectorAll('#service')
        for (let i = 0; i < list.length; i++) {
          list[i].value = "";
          handleFeaturesRemove(i);
        }
        // window.location = "http://localhost:3001/gigs";
        // console.log(list);
        // window.location.reload();
        // for (let i = 0; i < featureList.length; i++) {
        //   handleFeaturesRemove(i);
        // }

        // document.getElementById("selectCategory").selectedIndex = 0;
        // swal(resp.data.message, "", "success");
        console.log(resp);
        console.log(service);
      })
      .catch((errors) => {
        // swal(errors.response.data.message, "", "error");
        console.log(errors);
      });
  };

  return (
    <div className="add">
      <div className="addContainer">
        <h1>Add New Service</h1>
        <form id="serviceFrom" onSubmit={addServiceData}>
          <div className="sections">
            <div className="info">
              <label htmlFor="">Title</label>
              <input
                type="text"
                placeholder="e.g. I will do something I'm really good at"
                name="serviceTitle"
                required
                onChange={(e) =>
                  setService({ ...service, serviceTitle: e.target.value })
                }
              />
              <label htmlFor="">Category</label>

              <select
                name="serviceCategoryId"
                required
                onChange={(e) =>
                  setService({ ...service, serviceCategoryId: e.target.value })
                }
                id="selectCategory"
              >
                <option value={""} disabled selected>
                  Select Category
                </option>
                {categories.loading == false &&
                  categories.err == null &&
                  categories.results &&
                  categories.results.length > 0 &&
                  categories.results.map((category) => (
                    <>
                      <option value={category._id}>
                        {category.categoryName}
                      </option>
                    </>
                  ))}
              </select>
              <label htmlFor="">Cover Image</label>
              <input required type="file" accept="image/*" ref={coverImage} />
              <label htmlFor="">Upload Images</label>
              <input required accept="image/*" type="file" multiple ref={images} />
              <label htmlFor="">Description</label>
              <textarea
                name="serviceDesc"
                required
                onChange={(e) =>
                  setService({ ...service, serviceDesc: e.target.value })
                }
                placeholder="Brief descriptions to introduce your service to customers"
                cols="0"
                rows="16"
              ></textarea>
              <button type="submit">Create</button>
            </div>
            <div className="details">
              <label htmlFor="">Service Title</label>
              <input
                type="text"
                name="serviceShortTitle"
                required
                onChange={(e) =>
                  setService({ ...service, serviceShortTitle: e.target.value })
                }
                placeholder="e.g. One-page web design"
              />
              <label htmlFor="">Short Description</label>
              <textarea
                name="serviceShortDesc"
                required
                onChange={(e) =>
                  setService({ ...service, serviceShortDesc: e.target.value })
                }
                placeholder="Short description of your service"
                cols="30"
                rows="10"
              ></textarea>
              <label htmlFor="">Delivery Time (e.g. 3 days)</label>
              <input
                type="number"
                name="deliveryTime"
                required
                onChange={(e) =>
                  setService({ ...service, deliveryTime: e.target.value })
                }
              />
              <label htmlFor="">Revision Number</label>
              <input
                type="number"
                name="revisionNumber"
                required
                onChange={(e) =>
                  setService({ ...service, revisionNumber: e.target.value })
                }
              />
              <div className="form-field">
                <label htmlFor="service">Add Feature(s)</label>
                {featureList.map((singleFeature, index) => (
                  <div key={index} className="features">
                    <div className="first-division">
                      <input
                        className="featureInput"
                        name="feature"
                        type="text"
                        id="service"
                        value={singleFeature.feature}
                        onChange={(e) => handleFeaturesChange(e, index)}
                        required
                      />
                      {featureList.length - 1 === index && (
                        <img
                          onClick={handleFeaturesAdd} // Corrected event handler
                          className="add-img"
                          src="./img/add-image.png"
                        />
                      )}
                    </div>
                    <div className="second-division">
                      {featureList.length !== 1 && (
                        <img
                          onClick={() => handleFeaturesRemove(index)}
                          className="remove-img"
                          src="./img/remove-image.png"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <label htmlFor="">Price($)</label>
              <input
                name="servicePrice"
                required
                onChange={(e) =>
                  setService({ ...service, servicePrice: e.target.value })
                }
                type="number"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
