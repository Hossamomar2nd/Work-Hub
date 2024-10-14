import "../add/Add.scss";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { getAuthUser } from "../../localStorage/storage";

const UpdateService = () => {

    let { id } = useParams();

    const freelancer = getAuthUser();

    var [selectedFeaturesOptions, setSelectedFeaturesOptions] = useState();

    const [service, setService] = useState({
        loading: true,
        results: null,
        err: null,
        reload: 0,
        serviceTitle: "",
        serviceDesc: "",
        serviceCategoryId: "",
        serviceShortTitle: "",
        serviceShortDesc: "",
        servicePrice: "",
        // freelancerId: freelancer._id,
        revisionNumber: "",
        deliveryTime: "",
        coverImage: "",
        features: [],
        images: [],
    });

    if (selectedFeaturesOptions == undefined) {
        // formData.append("skills", user?.skills);
    }
    else {
        // formData.append("skills", selectedFeaturesOptions);
    }


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

    const serviceImages = useRef(null);

    const serviceCoverImage = useRef(null);

    const updateServiceImages = (id) => {

        const formData = new FormData();
        // formData.append("images", images.current.files[0]);

        for (let i = 0; i < serviceImages?.current.files.length; i++) {
            formData.append("serviceImages", serviceImages?.current.files[i]);
        }

        axios
            .put("http://localhost:3000/api/services/updateServiceImages/" + id, formData)
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

    const updateServiceCoverImage = (id) => {

        const formData = new FormData();
        formData.append("serviceCoverImage", serviceCoverImage?.current.files[0]);


        // for (let i = 0; i < coverImage.current.files.length; i++) {
        //   formData.append("images", coverImage.current.files[i]);
        // }
        axios
            .put("http://localhost:3000/api/services/updateServiceCoverImage/" + id, formData)
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
    //   console.log(featureList);

    const handleFeaturesChange = (e, index) => {
        const { name, value } = e.target;
        console.log(name);
        console.log(value);
        var list = [...featureList];
        list[index] = value;
        setFeatureList(list);
        console.log(list);
    };

    // const handleFeaturesArray = () => {
    //     var array = [];
    //     featureList.forEach((item) => {
    //         array.push(item.feature);
    //     });
    //     return array;
    // };

    const handleFeaturesRemove = (index) => {
        const list = [...featureList];
        list.splice(index, 1);
        setFeatureList(list);
    };

    const handleFeaturesAdd = () => {
        setFeatureList([...featureList, { feature: "" }]);
    };

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/services/getServiceById/" + id)
            .then((resp) => {
                // resp.data.freelancerId.skills = processData(resp.data.freelancerId.skills);
                // resp.data.freelancerId.languages = processData(resp.data.freelancerId.languages);
                setService({
                    ...service,
                    serviceTitle: resp.data.serviceTitle,
                    serviceShortTitle: resp.data.serviceShortTitle,
                    serviceShortDesc: resp.data.serviceShortDesc,
                    serviceDesc: resp.data.serviceDesc,
                    serviceCategoryId: resp.data.serviceCategoryId,
                    servicePrice: resp.data.servicePrice,
                    freelancerId: resp.data.freelancerId,
                    deliveryTime: resp.data.deliveryTime,
                    revisionNumber: resp.data.revisionNumber,
                    features: resp.data.features,
                    loading: false,
                    err: null
                });

                setFeatureList(resp.data.features)
                console.log(resp.data);
                // console.log(resp.data);
            })
            .catch((err) => {
                console.log(err);
                // setConversation({ ...conversation, loading: false, err: err.response.data.errors });
            });
    }, [service.reload]);

    const updateServiceData = async (e) => {
        e.preventDefault();

        console.log(serviceCoverImage);
        console.log(serviceImages);

        // handleFeaturesArray();

        setService({ ...service, loading: true, err: null });
        // const formData = new FormData();
        // formData.append("images", images.current.files[0]);
        // formData.append("cover_image", cover_image.current.files[0]);
        axios
            .put("http://localhost:3000/api/services/updateService/" + id, {
                serviceTitle: service.serviceTitle,
                serviceShortTitle: service.serviceShortTitle,
                serviceShortDesc: service.serviceShortDesc,
                serviceDesc: service.serviceDesc,
                serviceCategoryId: service.serviceCategoryId,
                servicePrice: service.servicePrice,
                freelancerId: service.freelancerId,
                deliveryTime: service.deliveryTime,
                revisionNumber: service.revisionNumber,
                features: featureList,
            })
            .then((resp) => {
                setService({ ...service, loading: false, err: null });
                const serviceId = id;
                // if (coverImage.current !== null) {
                // // }
                // console.log(serviceImages.current);
                // if (serviceImages.current !== null) {               
                // }



                
                // updateServiceImages(serviceId);
                // updateServiceCoverImage(serviceId);



                // uploadCoverImage(serviceId);
                // console.log(resp);
                // document.getElementById("serviceFrom").reset();
                // document.getElementById("service").value = "";
                // let list = document.querySelectorAll('#service')
                // for (let i = 0; i < list.length; i++) {
                //   list[i].value = "";
                //   handleFeaturesRemove(i);
                // }
                // console.log(list);
                // window.location.reload();
                // for (let i = 0; i < featureList.length; i++) {
                //   handleFeaturesRemove(i);
                // }

                // document.getElementById("selectCategory").selectedIndex = 0;
                // swal(resp.data.message, "", "success");
                // console.log(service);
                // window.location = "http://localhost:3001/gig/" + id;
                console.log(resp);
            })
            .catch((errors) => {
                // swal(errors.response.data.message, "", "error");
                console.log(errors);
            });
    };

    const navigation = () => {
        window.location = "http://localhost:3001/gig/" + service?.results._id;
    }

    return (
      <div className="add">
        {service.loading == false && (
          <>
            <div className="addContainer">
              <h1>Update Service</h1>
              <form onSubmit={updateServiceData} id="serviceFrom">
                <div className="sections">
                  <div className="info">
                    <label htmlFor="">Title</label>
                    <input
                      type="text"
                      placeholder="e.g. I will do something I'm really good at"
                      name="serviceTitle"
                      value={service?.serviceTitle}
                      onChange={(e) =>
                        setService({ ...service, serviceTitle: e.target.value })
                      }
                    />
                    <label htmlFor="">Category</label>

                    <select
                      name="serviceCategoryId"
                      value={service?.serviceCategoryId._id}
                      onChange={(e) =>
                        setService({
                          ...service,
                          serviceCategoryId: e.target.value,
                        })
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
                    <input type="file" ref={serviceCoverImage} />
                    <label htmlFor="">Upload Images</label>
                    <input type="file" multiple ref={serviceImages} />
                    <label htmlFor="">Description</label>
                    <textarea
                      name="serviceDesc"
                      value={service?.serviceDesc}
                      onChange={(e) =>
                        setService({ ...service, serviceDesc: e.target.value })
                      }
                      placeholder="Brief descriptions to introduce your service to customers"
                      cols="0"
                      rows="16"
                    ></textarea>
                    <button type="submit">Update</button>
                    <button
                      onClick={navigation}
                      className="cancelBtnUpdateService"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="details">
                    <label htmlFor="">Service Title</label>
                    <input
                      type="text"
                      name="serviceShortTitle"
                      value={service?.serviceShortTitle}
                      onChange={(e) =>
                        setService({
                          ...service,
                          serviceShortTitle: e.target.value,
                        })
                      }
                      placeholder="e.g. One-page web design"
                    />
                    <label htmlFor="">Short Description</label>
                    <textarea
                      name="serviceShortDesc"
                      value={service?.serviceShortDesc}
                      onChange={(e) =>
                        setService({
                          ...service,
                          serviceShortDesc: e.target.value,
                        })
                      }
                      placeholder="Short description of your service"
                      cols="30"
                      rows="10"
                    ></textarea>
                    <label htmlFor="">Delivery Time (e.g. 3 days)</label>
                    <input
                      type="number"
                      name="deliveryTime"
                      value={service?.deliveryTime}
                      onChange={(e) =>
                        setService({ ...service, deliveryTime: e.target.value })
                      }
                    />
                    <label htmlFor="">Revision Number</label>
                    <input
                      type="number"
                      name="revisionNumber"
                      value={service?.revisionNumber}
                      onChange={(e) =>
                        setService({
                          ...service,
                          revisionNumber: e.target.value,
                        })
                      }
                    />
                    <div className="form-field">
                      <label htmlFor="service">Update Feature(s)</label>
                      {/* {service?.results && service?.results.features.map((feature) => (
                                            <> */}
                      <div className="updateFeatures">
                        {featureList.map((feature, index) => (
                          <>
                            <div key={index} className="first-division">
                              <input
                                className="featureInput"
                                name="feature"
                                type="text"
                                id="service"
                                value={selectedFeaturesOptions}
                                required
                                defaultValue={feature}
                                onChange={(e) => handleFeaturesChange(e, index)}
                              />

                              {featureList.length > 1 && index !== 0 && (
                                <div className="second-division">
                                  <img
                                    onClick={() => handleFeaturesRemove(index)}
                                    className="updateService-remove-img"
                                    src="/img/remove-image.png"
                                  />
                                </div>
                              )}

                              {featureList.length - 1 === index && (
                                <div>
                                  <img
                                    onClick={handleFeaturesAdd} // Corrected event handler
                                    className={featureList.length > 1 ? "updateAdd-img_2" : "updateAdd-img"}
                                    src="/img/add-image.png"
                                  />
                                </div>
                              )}
                            </div>
                          </>
                        ))}
                      </div>
                      {/* </>
                                        ))} */}
                    </div>
                    <label htmlFor="">Price($)</label>
                    <input
                      name="servicePrice"
                      value={service?.servicePrice}
                      onChange={(e) =>
                        setService({ ...service, servicePrice: e.target.value })
                      }
                      type="number"
                    />
                  </div>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    );
};

export default UpdateService;
