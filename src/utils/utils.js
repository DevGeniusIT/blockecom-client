import axios from "axios";

export const connectToMetaMask = async () => {
  try {
    if (typeof window.ethereum !== "undefined") {
      // Kiểm tra xem có quyền truy cập ví hay không
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Nếu có tài khoản, thông báo kết nối thành công
      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        console.log(`Đã kết nối với ví MetaMask, địa chỉ ví: ${walletAddress}`);

        return walletAddress;
      } else {
        console.log("Ví MetaMask chưa được kết nối.");
        return null;
      }
    } else {
      console.log("Ví MetaMask không được hỗ trợ trong trình duyệt này.");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi kết nối đến MetaMask:", error);
    return null;
  }
};

export const getEth = async () => {
  try {
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=vnd";

    const res = await axios.get(url);

    if (res && res.data) {
      return res.data;
    } else {
      throw new Error("Không có dữ liệu từ API");
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    throw error; // Chuyển tiếp lỗi để xử lý ở phía gọi hàm
  }
};

export const convertETH = (priceEth, totalETH) => {
  const result = totalETH / priceEth;
  return result;
};
export const sendTransaction = async (total) => {
  console.log(total);
  try {
  const paymentAddress = "0xC0b4a18be9133106931b1E80e1abe8334C46E5Cf";
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  const senderAddress = accounts[0];
  const Wei = 1e18; // 1 Ether = 1e18 Wei

  // Chuyển đổi giá trị total thành số nguyên dương của Wei
  const weiValue = Math.floor(parseFloat(total) * Wei);

  const params = [
    {
      from: senderAddress,
      to: paymentAddress,
      value: `0x${weiValue.toString(16)}`, // Chuyển đổi giá trị sang hex format
      gasPrice: Number(10000000000).toString(16),
    },
  ];

    // Gửi giao dịch và chờ kết quả
    let result = await window.ethereum.request({ method: "eth_sendTransaction", params });

    // Nếu giao dịch thành công, trả về true
    if (result) {
      return true;
    } else {
      // Nếu giao dịch bị từ chối, trả về false
      return false;
    }
  } catch (error) {
    console.error("Lỗi khi gửi giao dịch:", error);
    // Nếu xảy ra lỗi, trả về false
    return false;
  }
};

