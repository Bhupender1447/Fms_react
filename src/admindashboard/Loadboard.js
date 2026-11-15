import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { BASE_URL } from "../config";
import "./Loadboard.css";

const emptyPost = {
  company: "",
  truck_id: "",
  truck_number: "",
  equipment_type: "Dry Van",
  origin_city: "",
  origin_region: "",
  destination_city: "",
  destination_region: "",
  available_date: "",
  contact_name: "",
  contact_phone: "",
  contact_email: "",
  notes: "",
};

const Loadboard = () => {
  const [form, setForm] = useState(emptyPost);
  const [posts, setPosts] = useState([]);
  const [loadPosts, setLoadPosts] = useState([]);
  const [fleetTrucks, setFleetTrucks] = useState([]);
  const [brokerOrders, setBrokerOrders] = useState([]);
  const [boardView, setBoardView] = useState("trucks");
  const [loadSearch, setLoadSearch] = useState("");
  const [fleetLoading, setFleetLoading] = useState(true);
  const [postFormOpen, setPostFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [fleetSearch, setFleetSearch] = useState("");
  const [originFilter, setOriginFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedOnline, setFeedOnline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [deletingLoadId, setDeletingLoadId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    let requestInProgress = false;
    const loadPosts = async () => {
      if (requestInProgress) return;
      requestInProgress = true;
      setRefreshing(true);
      const [postsResult, trucksResult, loadsResult, ordersResult] = await Promise.allSettled([
        axios.get(`${BASE_URL}api/loadboard/posts`, { withCredentials: true }),
        axios.get(`${BASE_URL}api/fetchtruckProductData`, { withCredentials: true }),
        axios.get(`${BASE_URL}api/loadboard/loads`, { withCredentials: true }),
        axios.get(`${BASE_URL}api/loadboard/orders`, { withCredentials: true }),
      ]);
      if (active) {
        if (postsResult.status === "fulfilled") {
          const rows = postsResult.value.data?.data;
          setPosts(Array.isArray(rows) ? rows : []);
          setFeedOnline(true);
          setLastUpdated(new Date());
        } else {
          setFeedOnline(false);
          setError(postsResult.reason?.response?.data?.message || "Could not load truck postings.");
        }
        if (trucksResult.status === "fulfilled") {
          setFleetTrucks(Array.isArray(trucksResult.value.data) ? trucksResult.value.data : []);
        } else {
          setError(trucksResult.reason?.response?.data?.message || "Could not load company fleet trucks.");
        }
        if (loadsResult.status === "fulfilled") {
          setLoadPosts(Array.isArray(loadsResult.value.data?.data) ? loadsResult.value.data.data : []);
        } else {
          setError(loadsResult.reason?.response?.data?.message || "Could not load broker load postings.");
        }
        if (ordersResult.status === "fulfilled") {
          setBrokerOrders(Array.isArray(ordersResult.value.data?.data) ? ordersResult.value.data.data : []);
        } else {
          setError(ordersResult.reason?.response?.data?.message || "Could not load broker orders.");
        }
        if ([postsResult, trucksResult, loadsResult, ordersResult].every((result) => result.status === "fulfilled")) setError("");
        setLoading(false);
        setFleetLoading(false);
        setRefreshing(false);
      }
      requestInProgress = false;
    };
    loadPosts();
    const interval = window.setInterval(loadPosts, 30000);
    return () => { active = false; window.clearInterval(interval); };
  }, [refresh]);

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesSearch = !term || [
      post.company, post.truck_number, post.equipment_type,
      post.origin_city, post.origin_region, post.destination_city,
      post.destination_region, post.notes,
      ].some((value) => String(value || "").toLowerCase().includes(term));
      const origin = `${post.origin_city || ""} ${post.origin_region || ""}`.toLowerCase();
      const destination = `${post.destination_city || ""} ${post.destination_region || ""}`.toLowerCase();
      return matchesSearch
        && (!originFilter || origin.includes(originFilter.trim().toLowerCase()))
        && (!destinationFilter || destination.includes(destinationFilter.trim().toLowerCase()))
        && (!equipmentFilter || String(post.equipment_type || "").toLowerCase() === equipmentFilter.toLowerCase());
    });
  }, [posts, search, originFilter, destinationFilter, equipmentFilter]);

  const filteredLoadPosts = useMemo(() => {
    const term = loadSearch.trim().toLowerCase();
    if (!term) return loadPosts;
    return loadPosts.filter((load) => [load.company, load.load_number, load.equipment_type, load.origin_city,
      load.origin_region, load.destination_city, load.destination_region, load.notes]
      .some((value) => String(value || "").toLowerCase().includes(term)));
  }, [loadPosts, loadSearch]);

  const postedTruckIds = useMemo(() => new Set(posts.map((post) => String(post.truck_id || "")).filter(Boolean)), [posts]);
  const postedTruckNumbers = useMemo(() => new Set(posts.map((post) => String(post.truck_number || "").trim().toLowerCase()).filter(Boolean)), [posts]);
  const isTruckPosted = (truck) => postedTruckIds.has(String(truck.id))
    || [truck.plateno, truck.name].some((number) => number && postedTruckNumbers.has(String(number).trim().toLowerCase()));
  const filteredFleetTrucks = useMemo(() => {
    const term = fleetSearch.trim().toLowerCase();
    return fleetTrucks.filter((truck) => !term || [truck.name, truck.plateno, truck.make, truck.year, truck.state, truck.country]
      .some((value) => String(value || "").toLowerCase().includes(term)));
  }, [fleetTrucks, fleetSearch]);

  const updateField = (event) => setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));

  const submitPost = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      const response = await axios.post(`${BASE_URL}api/loadboard/posts`, payload, { withCredentials: true });
      const postedTruck = {
        ...form,
        id: response.data?.id || `pending-${Date.now()}`,
        status: "available",
      };
      const postedTruckNumber = String(form.truck_number || "").trim().toLowerCase();
      setPosts((currentPosts) => [postedTruck, ...currentPosts.filter((post) =>
        String(post.truck_id || "") !== String(form.truck_id)
        && String(post.truck_number || "").trim().toLowerCase() !== postedTruckNumber)]);
      setLastUpdated(new Date());
      setForm(emptyPost);
      setPostFormOpen(false);
      setNotice("Truck posted and is now live on the company board.");
      setRefresh((value) => value + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not post this truck. Please check the details and try again.");
    } finally {
      setSaving(false);
    }
  };

  const postBrokerOrder = async (order) => {
    setError("");
    setNotice("");
    try {
      const response = await axios.post(`${BASE_URL}api/loadboard/loads`, { order_id: order.id }, { withCredentials: true });
      const newLoad = response.data?.data;
      if (newLoad) setLoadPosts((current) => [newLoad, ...current.filter((load) => String(load.order_id) !== String(order.id))]);
      setBrokerOrders((current) => current.filter((item) => String(item.id) !== String(order.id)));
      setNotice(`Order ${order.customer_orderno || order.loadno || order.id} posted as a live load.`);
      setLastUpdated(new Date());
      setRefresh((value) => value + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not post this broker order as a load.");
    }
  };

  const deleteLoadPost = async (load) => {
    if (!window.confirm(`Delete load ${load.load_number}? It will be removed from the active board.`)) return;
    setDeletingLoadId(load.id);
    setError("");
    setNotice("");
    try {
      await axios.delete(`${BASE_URL}api/loadboard/loads/${load.id}`, { withCredentials: true });
      setNotice(`Load ${load.load_number} was removed from the Loadboard.`);
      setRefresh((value) => value + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete this load posting.");
    } finally {
      setDeletingLoadId(null);
    }
  };

  const deletePost = async (post) => {
    if (!window.confirm(`Delete the posting for truck ${post.truck_number}? It will be removed from the active board.`)) return;
    setDeletingPostId(post.id);
    setError("");
    setNotice("");
    try {
      await axios.delete(`${BASE_URL}api/loadboard/posts/${post.id}`, { withCredentials: true });
      setNotice(`Truck ${post.truck_number} was removed from the Loadboard.`);
      setRefresh((value) => value + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete this truck posting.");
    } finally {
      setDeletingPostId(null);
    }
  };

  return (
    <main className="content-wrapper ifm-loadboard">
      <section className="content-header ifm-loadboard-heading">
        <div>
          <span className="ifm-loadboard-eyebrow">FLEET MARKETPLACE</span>
          <h1>Freight Loadboard</h1>
          <p>Post company trucks or broker loads and find available capacity.</p>
        </div>
        <div className="ifm-board-actions">
          <span className="ifm-board-source"><i className="fa fa-database" aria-hidden="true" /> IFM company board</span>
          <button type="button" className="ifm-loadlink-link" onClick={() => {
            if (boardView === "trucks") {
              setPostFormOpen(true);
              setTimeout(() => document.getElementById("ifm-post-truck")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
            } else {
              document.getElementById("ifm-broker-orders")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}>
            <i className="fa fa-plus" aria-hidden="true" /> {boardView === "trucks" ? "Post a truck" : "Post a load"}
          </button>
        </div>
      </section>
      <section className="content ifm-loadboard-content">
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {notice && <div className="alert alert-success" role="status">{notice}</div>}

        <div className="ifm-board-toolbar">
          <div className="ifm-board-tabs" aria-label="Loadboard posting categories">
            <button type="button" className={`ifm-board-tab${boardView === "trucks" ? " active" : ""}`} onClick={() => setBoardView("trucks")} aria-pressed={boardView === "trucks"}>
              <i className="fa fa-truck" aria-hidden="true" /> Truck Posting <span>{posts.length}</span>
            </button>
            <button type="button" className={`ifm-board-tab${boardView === "loads" ? " active" : ""}`} onClick={() => setBoardView("loads")} aria-pressed={boardView === "loads"}>
              <i className="fa fa-cubes" aria-hidden="true" /> Load Posting <span>{loadPosts.length}</span>
            </button>
          </div>
          <div className={`ifm-live-status${feedOnline ? "" : " offline"}`} aria-live="polite">
            <span className="ifm-live-dot" /> {feedOnline ? "Live IFM updates" : lastUpdated ? "IFM feed delayed" : "Connecting to IFM..."}
            <span className="ifm-updated-label">{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : "Connecting..."}</span>
            <button type="button" className="ifm-refresh-button" onClick={() => setRefresh((value) => value + 1)} disabled={refreshing} aria-label="Refresh loadboard postings">
              <i className={`fa fa-refresh${refreshing ? " fa-spin" : ""}`} aria-hidden="true" /> Refresh
            </button>
          </div>
        </div>

        {boardView === "trucks" ? <div className="row">
          <div className="col-lg-6 col-md-6">
            <div className="ifm-board-panel">
              <div className="ifm-panel-title"><div><h2>Posted trucks</h2><span>{posts.length} currently on the board</span></div></div>
              <div className="ifm-filter-grid">
                <label>Origin
                  <input className="form-control" placeholder="City, state or province" value={originFilter} onChange={(event) => setOriginFilter(event.target.value)} />
                </label>
                <label>Destination
                  <input className="form-control" placeholder="City, state or province" value={destinationFilter} onChange={(event) => setDestinationFilter(event.target.value)} />
                </label>
                <label>Equipment
                  <select className="form-control" value={equipmentFilter} onChange={(event) => setEquipmentFilter(event.target.value)}>
                    <option value="">All equipment</option>
                    {["Dry Van", "Reefer", "Flatbed", "Step Deck", "Power Only", "Box Truck", "Other"].map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </label>
                <label>Search postings
                  <input className="form-control" placeholder="Carrier, truck, or keyword" value={search} onChange={(event) => setSearch(event.target.value)} />
                </label>
              </div>
              <div className="ifm-results-heading" id="ifm-available-trucks">
                <div><h2>Available trucks</h2><span>{filteredPosts.length} {filteredPosts.length === 1 ? "posting" : "postings"} found</span></div>
                <span className="ifm-auto-refresh"><i className="fa fa-clock-o" aria-hidden="true" /> Auto refresh: 30 sec</span>
              </div>
              <div className="ifm-posting-list" aria-live="polite">
                {loading ? <div className="ifm-empty-state" role="status">Loading available trucks...</div> : filteredPosts.length === 0 ? (
                  <div className="ifm-empty-state">
                    <i className="fa fa-truck" aria-hidden="true" />
                    <h3>{posts.length ? "No trucks match these filters" : "No trucks posted yet"}</h3>
                    <p>{posts.length ? "Try changing the route, equipment, or search filters." : "Post your first available truck to make it visible to your team."}</p>
                  </div>
                ) : filteredPosts.map((post) => (
                  <article className="ifm-posting-card" key={post.id}>
                    <div className="ifm-posting-main">
                      <div className="ifm-posting-route">
                        <div><span className="ifm-route-label">ORIGIN</span><strong>{post.origin_city}{post.origin_region ? `, ${post.origin_region}` : ""}</strong></div>
                        <i className="fa fa-long-arrow-right" aria-hidden="true" />
                        <div><span className="ifm-route-label">DESTINATION</span><strong>{post.destination_city}{post.destination_region ? `, ${post.destination_region}` : ""}</strong></div>
                      </div>
                      {post.notes && <p className="ifm-posting-notes">{post.notes}</p>}
                    </div>
                    <div className="ifm-posting-meta">
                      <span className="ifm-live-post-badge"><span /> LIVE{Number(post.is_demo) === 1 ? " | DEMO" : ""}</span>
                      <span className="ifm-equipment-tag"><i className="fa fa-truck" aria-hidden="true" /> {post.equipment_type}</span>
                      <strong>{post.company}</strong>
                      <span>Truck {post.truck_number}</span>
                    </div>
                    <div className="ifm-posting-availability">
                      <span className="ifm-route-label">AVAILABLE</span>
                      <strong>{post.available_date}</strong>
                      {post.contact_phone && <a href={`tel:${post.contact_phone}`} className="ifm-contact-link"><i className="fa fa-phone" aria-hidden="true" /> Contact</a>}
                      {!post.contact_phone && post.contact_email && <a href={`mailto:${post.contact_email}`} className="ifm-contact-link"><i className="fa fa-envelope" aria-hidden="true" /> Contact</a>}
                      {post.contact_name && <small>{post.contact_name}</small>}
                      <button type="button" className="ifm-delete-post" onClick={() => deletePost(post)} disabled={deletingPostId === post.id}>
                        <i className="fa fa-trash" aria-hidden="true" /> {deletingPostId === post.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6">
            <div className="ifm-fleet-panel">
              <div className="ifm-panel-title"><div><h2>Company trucks</h2><span>{fleetTrucks.length} trucks in the Isovia fleet</span></div><i className="fa fa-truck" aria-hidden="true" /></div>
              <div className="ifm-fleet-search"><input className="form-control" aria-label="Search company trucks" placeholder="Search truck, plate, or make" value={fleetSearch} onChange={(event) => setFleetSearch(event.target.value)} /></div>
              <div className="ifm-fleet-list" aria-live="polite">
                {fleetLoading ? <div className="ifm-empty-state" role="status">Loading company trucks...</div> : filteredFleetTrucks.length === 0 ? (
                  <div className="ifm-empty-state"><i className="fa fa-truck" aria-hidden="true" /><h3>{fleetTrucks.length ? "No trucks match this search" : "No company trucks found"}</h3><p>{fleetTrucks.length ? "Try another truck name or plate number." : "Add trucks to the company fleet to post them here."}</p></div>
                ) : filteredFleetTrucks.map((truck) => {
                  const alreadyPosted = isTruckPosted(truck);
                  return (
                    <article className="ifm-fleet-card" key={truck.id}>
                      <span className="ifm-fleet-icon"><i className="fa fa-truck" aria-hidden="true" /></span>
                      <div className="ifm-fleet-info"><strong>{truck.name || `Truck ${truck.id}`}</strong><span>{truck.plateno || "No plate"}{truck.make ? ` · ${truck.make}` : ""}{truck.year ? ` · ${truck.year}` : ""}</span><small>{truck.state || truck.country || "Company fleet"}</small></div>
                      <div className="ifm-fleet-post-state"><span className={alreadyPosted ? "posted" : "available"}>{alreadyPosted ? "Posted" : "Available"}</span>{!alreadyPosted && <button type="button" onClick={() => { setForm((previous) => ({ ...previous, truck_id: truck.id, truck_number: truck.plateno || truck.name || `Truck ${truck.id}` })); setPostFormOpen(true); setTimeout(() => document.getElementById("ifm-post-truck")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0); }}>Post</button>}</div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div> : <div className="row">
          <div className="col-lg-6 col-md-6">
            <div className="ifm-board-panel">
              <div className="ifm-panel-title"><div><h2>Posted loads</h2><span>{loadPosts.length} loads currently on the board</span></div></div>
              <div className="ifm-fleet-search"><input className="form-control" aria-label="Search posted loads" placeholder="Search broker, load, or route" value={loadSearch} onChange={(event) => setLoadSearch(event.target.value)} /></div>
              <div className="ifm-posting-list" aria-live="polite">
                {loading ? <div className="ifm-empty-state" role="status">Loading posted loads...</div> : filteredLoadPosts.length === 0 ? (
                  <div className="ifm-empty-state"><i className="fa fa-cubes" aria-hidden="true" /><h3>{loadPosts.length ? "No loads match this search" : "No loads posted yet"}</h3><p>Post an unassigned broker order to show it here.</p></div>
                ) : filteredLoadPosts.map((load) => (
                  <article className="ifm-posting-card ifm-load-posting-card" key={load.id}>
                    <div className="ifm-posting-main">
                      <div className="ifm-posting-route">
                        <div><span className="ifm-route-label">PICKUP</span><strong>{load.origin_city}{load.origin_region ? `, ${load.origin_region}` : ""}</strong><small>{load.pickup_date || "Date not set"}</small></div>
                        <i className="fa fa-long-arrow-right" aria-hidden="true" />
                        <div><span className="ifm-route-label">DELIVERY</span><strong>{load.destination_city}{load.destination_region ? `, ${load.destination_region}` : ""}</strong><small>{load.delivery_date || "Date not set"}</small></div>
                      </div>
                      {load.notes && <p className="ifm-posting-notes">{load.notes}</p>}
                    </div>
                    <div className="ifm-posting-meta">
                      <span className="ifm-live-post-badge"><span /> LIVE{Number(load.is_demo) === 1 ? " | DEMO" : ""}</span>
                      <span className="ifm-equipment-tag"><i className="fa fa-cubes" aria-hidden="true" /> {load.equipment_type || "Equipment open"}</span>
                      <strong>{load.company || "Broker"}</strong>
                      <span>Load {load.load_number}</span>
                    </div>
                    <div className="ifm-posting-availability">
                      <span className="ifm-route-label">OFFER</span>
                      <strong>{load.rate_amount ? `${load.currency} ${Number(load.rate_amount).toLocaleString()}` : "Contact broker"}</strong>
                      <button type="button" className="ifm-delete-post" onClick={() => deleteLoadPost(load)} disabled={deletingLoadId === load.id}>
                        <i className="fa fa-trash" aria-hidden="true" /> {deletingLoadId === load.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <div className="ifm-fleet-panel" id="ifm-broker-orders">
              <div className="ifm-panel-title"><div><h2>Broker orders ready to post</h2><span>{brokerOrders.length} unassigned orders</span></div><i className="fa fa-file-text-o" aria-hidden="true" /></div>
              <div className="ifm-fleet-list" aria-live="polite">
                {loading ? <div className="ifm-empty-state" role="status">Loading broker orders...</div> : brokerOrders.length === 0 ? (
                  <div className="ifm-empty-state"><i className="fa fa-file-text-o" aria-hidden="true" /><h3>No broker orders ready</h3><p>Create an unassigned broker order with pickup and delivery addresses, then post it here.</p></div>
                ) : brokerOrders.map((order) => (
                  <article className="ifm-fleet-card ifm-order-card" key={order.id}>
                    <span className="ifm-fleet-icon"><i className="fa fa-file-text-o" aria-hidden="true" /></span>
                    <div className="ifm-fleet-info"><strong>{order.company || "Broker order"}</strong><span>Load {order.loadno || order.customer_orderno || order.id} | {order.pickup_address} to {order.delivery_address}</span><small>{order.trailortype || "Equipment open"} | Pickup {order.pickup_date || "Date not set"} | {order.currency || "CAD"} {order.gross_amount || "Rate not set"}</small></div>
                    <div className="ifm-fleet-post-state"><span className="available">Ready</span><button type="button" onClick={() => postBrokerOrder(order)}>Post load</button></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>}

        {boardView === "trucks" && postFormOpen && <div className="row" id="ifm-post-truck">
          <div className="col-md-12">
            <div className="ifm-post-form-panel">
              <div className="ifm-post-form-heading"><span className="ifm-post-form-icon"><i className="fa fa-plus" aria-hidden="true" /></span><div><h2>Post a company truck</h2><p>Share this truck and its available route with your company.</p></div><button type="button" className="ifm-form-close" onClick={() => setPostFormOpen(false)} aria-label="Close truck posting form">×</button></div>
              <form onSubmit={submitPost}>
                <div className="ifm-post-form-body">
                  <div className="form-group">
                    <label htmlFor="loadboard-company">Company / Carrier *</label>
                    <input id="loadboard-company" className="form-control" name="company" value={form.company} onChange={updateField} required maxLength={160} />
                  </div>
                  <div className="row">
                    <div className="col-sm-6 form-group">
                      <label htmlFor="loadboard-truck">Company truck *</label>
                      <select id="loadboard-truck" className="form-control" name="truck_id" value={form.truck_id} onChange={(event) => { const truck = fleetTrucks.find((item) => String(item.id) === event.target.value); setForm((previous) => ({ ...previous, truck_id: event.target.value, truck_number: truck?.plateno || truck?.name || (truck ? `Truck ${truck.id}` : "") })); }} required>
                        <option value="">Select a company truck</option>
                        {fleetTrucks.map((truck) => <option key={truck.id} value={truck.id}>{truck.name || `Truck ${truck.id}`} · {truck.plateno || "No plate"}</option>)}
                      </select>
                      <input type="hidden" name="truck_number" value={form.truck_number} />
                    </div>
                    <div className="col-sm-6 form-group">
                      <label htmlFor="loadboard-equipment">Equipment *</label>
                      <select id="loadboard-equipment" className="form-control" name="equipment_type" value={form.equipment_type} onChange={updateField} required>
                        {["Dry Van", "Reefer", "Flatbed", "Step Deck", "Power Only", "Box Truck", "Other"].map((type) => <option key={type}>{type}</option>)}
                      </select>
                    </div>
                  </div>
                  <h4>Planned route</h4>
                  <div className="row">
                    <div className="col-sm-7 form-group">
                      <label htmlFor="loadboard-origin">Origin city *</label>
                      <input id="loadboard-origin" className="form-control" name="origin_city" value={form.origin_city} onChange={updateField} required maxLength={120} />
                    </div>
                    <div className="col-sm-5 form-group">
                      <label htmlFor="loadboard-origin-region">State / Province</label>
                      <input id="loadboard-origin-region" className="form-control" name="origin_region" value={form.origin_region} onChange={updateField} maxLength={80} />
                    </div>
                    <div className="col-sm-7 form-group">
                      <label htmlFor="loadboard-destination">Destination city *</label>
                      <input id="loadboard-destination" className="form-control" name="destination_city" value={form.destination_city} onChange={updateField} required maxLength={120} />
                    </div>
                    <div className="col-sm-5 form-group">
                      <label htmlFor="loadboard-destination-region">State / Province</label>
                      <input id="loadboard-destination-region" className="form-control" name="destination_region" value={form.destination_region} onChange={updateField} maxLength={80} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="loadboard-date">Available date *</label>
                    <input id="loadboard-date" type="date" className="form-control" name="available_date" value={form.available_date} onChange={updateField} required />
                  </div>
                  <h4>Contact (optional)</h4>
                  <div className="form-group">
                    <label htmlFor="loadboard-contact">Contact name</label>
                    <input id="loadboard-contact" className="form-control" name="contact_name" value={form.contact_name} onChange={updateField} maxLength={120} />
                  </div>
                  <div className="row">
                    <div className="col-sm-6 form-group">
                      <label htmlFor="loadboard-phone">Phone</label>
                      <input id="loadboard-phone" type="tel" className="form-control" name="contact_phone" value={form.contact_phone} onChange={updateField} maxLength={40} />
                    </div>
                    <div className="col-sm-6 form-group">
                      <label htmlFor="loadboard-email">Email</label>
                      <input id="loadboard-email" type="email" className="form-control" name="contact_email" value={form.contact_email} onChange={updateField} maxLength={160} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="loadboard-notes">Notes</label>
                    <textarea id="loadboard-notes" className="form-control" name="notes" value={form.notes} onChange={updateField} rows={3} maxLength={1000} placeholder="Availability, trailer details, or route preferences" />
                  </div>
                </div>
                <div className="ifm-post-form-footer">
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Posting..." : "Post truck"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>}
      </section>
    </main>
  );
};

export default Loadboard;
