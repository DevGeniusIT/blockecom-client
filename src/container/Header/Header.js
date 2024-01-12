import React from "react";
import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getItemCartStart } from "../../action/ShopCartAction";
import { listRoomOfUser } from "../../services/userService";
import "./Header.scss";
import TopMenu from "./TopMenu";
import socketIOClient from "socket.io-client";
import { FaEthereum } from "react-icons/fa";
import { connectMetaMask, connectToMetaMask } from "../../utils/utils";
import { IoMdClose } from "react-icons/io";

require("dotenv").config();
const Header = (props) => {
  const [quantityMessage, setquantityMessage] = useState("");
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  let dataCart = useSelector((state) => state.shopcart.listCartItem);
  const host = process.env.REACT_APP_BACKEND_URL;
  const socketRef = useRef();
  const [id, setId] = useState();
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUser(userData);
    if (userData) {
      dispatch(getItemCartStart(userData.id));
      socketRef.current.on("getId", (data) => {
        setId(data);
      }); // phần này đơn giản để gán id cho mỗi phiên kết nối vào page. Mục đích chính là để phân biệt đoạn nào là của mình đang chat.
      fetchListRoom(userData.id);

      socketRef.current.on("sendDataServer", (dataGot) => {
        fetchListRoom(userData.id);
      });
      socketRef.current.on("loadRoomServer", (dataGot) => {
        fetchListRoom(userData.id);
      });
      return () => {
        socketRef.current.disconnect();
      };
    }
  }, []);
  const token = localStorage.getItem("token");

  const handleConnect = async () => {
    const walletInfo = await connectToMetaMask();
    console.log("Wallet Info:", walletInfo);
    if (walletInfo) {
      setWalletAddress(walletInfo);
    }
    // Đây là nơi bạn có thể xử lý thông tin của ví sau khi kết nối thành công
  };

  const handleDisconnect = () => {
    // Hiển thị cửa sổ xác nhận khi người dùng nhấn vào biểu tượng hủy kết nối
    if (window.confirm("Bạn có muốn hủy kết nối không?")) {
      // Xử lý hủy kết nối ở đây
      setWalletAddress(null); 
      // Ví dụ: Thiết lập walletAddress thành null để đánh dấu đã hủy kết nối
    }
  };

  let scrollHeader = () => {
    window.addEventListener("scroll", function () {
      var header = document.querySelector(".main_menu");
      if (header) {
        header.classList.toggle("sticky", window.scrollY > 0);
      }
    });
  };
  let fetchListRoom = async (userId) => {
    let res = await listRoomOfUser(userId);
    if (res && res.errCode == 0) {
      let count = 0;
      if (
        res.data &&
        res.data.length > 0 &&
        res.data[0].messageData &&
        res.data[0].messageData.length > 0
      ) {
        res.data[0].messageData.forEach((item) => {
          if (item.unRead === 1 && item.userId !== userId) count = count + 1;
        });
      }

      setquantityMessage(count);
    }
  };
  scrollHeader();

  return (
    <header className="header_area">
      <TopMenu user={user && user} />
      <div className="main_menu">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light w-100">
            {/* Brand and toggle get grouped for better mobile display */}
            <NavLink to="/" className="navbar-brand logo_h">
              <img src="/resources/img/logo.png" alt="" />
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            {/* Collect the nav links, forms, and other content for toggling */}
            <div
              className="collapse navbar-collapse offset w-100"
              id="navbarSupportedContent"
            >
              <div className="row w-100 mr-0">
                <div className="col-lg-9 pr-0">
                  <ul className="nav navbar-nav center_nav pull-right">
                    <li className="nav-item">
                      <NavLink
                        exact
                        to="/"
                        className="nav-link"
                        activeClassName="selected"
                        activeStyle={{ color: "#71cd14" }}
                      >
                        Trang chủ
                      </NavLink>
                    </li>
                    <li className="nav-item ">
                      <NavLink
                        to="/shop"
                        className="nav-link"
                        activeClassName="selected"
                        activeStyle={{ color: "#71cd14" }}
                      >
                        Cửa hàng
                      </NavLink>
                    </li>
                    <li className="nav-item ">
                      <NavLink
                        to="/blog"
                        className="nav-link"
                        activeClassName="selected"
                        activeStyle={{ color: "#71cd14" }}
                      >
                        Tin tức
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/voucher"
                        className="nav-link"
                        activeClassName="selected"
                        activeStyle={{ color: "#71cd14" }}
                      >
                        Giảm giá
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/about"
                        className="nav-link"
                        activeClassName="selected"
                        activeStyle={{ color: "#71cd14" }}
                      >
                        Giới thiệu
                      </NavLink>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-3 pr-0">
                  <ul className="nav navbar-nav navbar-right right_nav pull-right">
                    <li className="">
                      {walletAddress ? (
                        <div className="mt-4">
                          <button className="btn-mtm">
                            {walletAddress.slice(0, 6) +
                              "..." +
                              walletAddress.slice(-3)}
                            <IoMdClose
                              className="ml-2 btn-close cursor-pointer"
                              onClick={handleDisconnect}
                            />
                          </button>
                        </div>
                      ) : (
                        <div onClick={handleConnect} className="mt-4">
                          <button className="btn-connect">Connect</button>
                        </div>
                      )}
                    </li>
                    <li className="nav-item">
                      <Link to={"/user/messenger"} className="icons">
                        <i class="fa-brands fa-facebook-messenger"></i>
                      </Link>
                      {quantityMessage > 0 && (
                        <span className="box-message-quantity">
                          {quantityMessage}
                        </span>
                      )}
                    </li>
                    <li className="nav-item">
                      <Link to={"/shopcart"} className="icons">
                        <i className="ti-shopping-cart" />
                      </Link>
                      <span className="box-quantity-cart">
                        {dataCart && dataCart.length}
                      </span>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={`/user/detail/${user && user.id ? user.id : ""}`}
                        className="icons"
                      >
                        <i className="ti-user" aria-hidden="true" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
