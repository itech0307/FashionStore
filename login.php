<?php
include "db.php";

session_start();


#Nếu thông tin xác thực do người dùng cung cấp khớp thành công với dữ liệu có sẵn trong cơ sở dữ liệu thì sẽ lặp lại chuỗi login_success
#chuỗi login_success sẽ quay lại để gọi Anonymous funtion $("#login").click() 
if(isset($_POST["email"]) && isset($_POST["password"])){
	$email = mysqli_real_escape_string($con,$_POST["email"]);
	$password = md5($_POST["password"]);
	$sql = "SELECT * FROM user_info WHERE email = '$email' AND password = '$password'";
	$run_query = mysqli_query($con,$sql);
	$count = mysqli_num_rows($run_query);
	//nếu bản ghi người dùng có sẵn trong cơ sở dữ liệu thì $count sẽ bằng 1
	if($count == 1){
		$row = mysqli_fetch_array($run_query);
		$_SESSION["uid"] = $row["user_id"];
		$_SESSION["name"] = $row["first_name"];
		$ip_add = getenv("REMOTE_ADDR");
		//tạo một cookie trong trang login_form.php nên nếu cookie đó có nghĩa là người dùng chưa đăng nhập
			if (isset($_COOKIE["product_list"])) {
				$p_list = stripcslashes($_COOKIE["product_list"]);
				//giải mã cookie danh sách sản phẩm json được lưu trữ thành mảng bình thường
				$product_list = json_decode($p_list,true);
				for ($i=0; $i < count($product_list); $i++) { 
					//Sau khi lấy id người dùng từ cơ sở dữ liệu ở đây, kiểm tra mục giỏ hàng của người dùng nếu đã có sản phẩm được liệt kê hay chưa
					$verify_cart = "SELECT id FROM cart WHERE user_id = $_SESSION[uid] AND p_id = ".$product_list[$i];
					$result  = mysqli_query($con,$verify_cart);
					if(mysqli_num_rows($result) < 1){
						//nếu người dùng thêm sản phẩm lần đầu vào giỏ hàng, sẽ cập nhật user_id vào bảng cơ sở dữ liệu với id hợp lệ
						$update_cart = "UPDATE cart SET user_id = '$_SESSION[uid]' WHERE ip_add = '$ip_add' AND user_id = -1";
						mysqli_query($con,$update_cart);
					}else{
						//nếu sản phẩm đó đã có sẵn trong bảng cơ sở dữ liệu, sẽ xóa bản ghi đó
						$delete_existing_product = "DELETE FROM cart WHERE user_id = -1 AND ip_add = '$ip_add' AND p_id = ".$product_list[$i];
						mysqli_query($con,$delete_existing_product);
					}
				}
				//hủy cookie của người dùng
				setcookie("product_list","",strtotime("-1 day"),"/");
				//nếu người dùng đang đăng nhập từ sau trang giỏ hàng,sẽ gửi cart_login
				echo "cart_login";
				exit();
				
			}
			//nếu người dùng đăng nhập từ trang, chúng tôi sẽ gửi login_success
			echo "login_success";
			exit();
		}else{
			echo "<span style='color:red;'>Please register before login..!</span>";
			exit();
		}
	
}
