import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import { gigs } from "../../data";
import GigCard from "../../components/GigCard/GigCard";
import axios from "axios";
import swal from "sweetalert";
import { Link, useLocation, useParams } from "react-router-dom";
import { getAuthUser } from '../../localStorage/storage';
import { sidebarStatus } from "../../App";
import Alert from "@mui/material/Alert";

function GigsFilter() {

  const user = getAuthUser();

  let { id } = useParams();

  const [filterService, setFilterService] = useState({
    loading: true,
    results: null,
    err: null,
    reload: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/services/getServicesByCategoryId/" + id)
      .then((resp) => {
        setFilterService({ results: resp.data.services, loading: false, err: null });
        // console.log(resp);
        console.log(resp.data);
      })
      .catch((err) => {
        console.log(err);
        setFilterService({ ...filterService, loading: false, err: err.response.data.msg });
      });
  }, [filterService.reload]);

  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  const apply = () => {
    console.log(minRef.current.value)
    console.log(maxRef.current.value)
  }

  const { pathname } = useLocation();

  const [categories, setCategories] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0
  });

  useEffect(() => {
    setCategories({ ...categories, loading: true })
    axios.get("http://localhost:3000/api/categories/getAllCategories")
      .then(
        resp => {
          console.log(resp.data);
          setCategories({ results: resp.data, loading: false, err: null });
          console.log(resp);
        }
      ).catch(err => {
        setCategories({ ...categories, loading: false, err: err.response.data.msg });
        console.log(err);
      })
  }, [categories.reload]);

  return (
    <div className={pathname !== "/adminGigs" ? "gigs" : "adminGigs"}>
      <div className={sidebarStatus() ? "gigsContainer" : "allGigsContainer"}>
        {categories.results.category && <span className="marketplaceTitle">MarketPlace</span>}
        <div className="breadcrumbs">
          {user == undefined ? <Link reloadDocument className="breadcrumbsLink" to={"/"}><img className="homeIconImg" src="../img/homeIcon.png" /> Home {'>'}</Link> : null}
        </div>
        {filterService !== undefined ?
          <>
            {filterService.loading == false && filterService.err == null &&
              filterService.results && (
                <>
                  <h1>{filterService.results[0].serviceCategoryId.categoryName}</h1>
                  <p>
                    {filterService.results[0].serviceCategoryId.categoryDesc}
                  </p>
                </>
              )
            }
          </>
          : null}
        {user && user.role !== "admin" &&
          <div className="menu">
            <div className="left">
              <span>Budget</span>
              <input ref={minRef} type="number" placeholder="min" />
              <input ref={maxRef} type="number" placeholder="max" />
              <button onClick={apply}>Apply</button>
            </div>
            <div className="right">
              <span className="sortBy">Sort by</span>
              <span className="sortType">
                {sort === "sales" ? "Best Selling" : "Newest"}
              </span>
              <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
              {open && (
                <div className="rightMenu">
                  {sort === "sales" ? (
                    <span onClick={() => reSort("createdAt")}>Newest</span>
                  ) : (
                    <span onClick={() => reSort("sales")}>Best Selling</span>
                  )}
                  <span onClick={() => reSort("sales")}>Popular</span>
                </div>
              )}
            </div>
          </div>
        }
        <div className={sidebarStatus() ? "gigsCards" : "allGigsCards"}>
          {filterService.loading == false &&
            filterService.err == null &&
            filterService.results &&
            filterService.results.length > 0 &&
            filterService.results.map((service) => (
              <GigCard key={service._id} item={service} />
            ))}
        </div>
        {filterService.err !== null &&
            <div className='serviceFilterAlert'>
                <Alert severity="info">{filterService.err}</Alert>
            </div>
        }
      </div>
    </div>
  );
}
export default GigsFilter;
