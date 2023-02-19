$(document).ready(function () {
  cat();
  brand();
  product();
  // cat() là hàm lấy dữ liệu categories từ csdl
  function cat() {
    $.ajax({
      url: "action.php",
      method: "POST",
      data: { category: 1 },
      success: function (data) {
        $("#get_category").html(data);
      },
    });
  }

  // brand() là hàm lấy dữ liệu brand từ csdl
  function brand() {
    $.ajax({
      url: "action.php",
      method: "POST",
      data: { brand: 1 },
      success: function (data) {
        $("#get_brand").html(data);
      },
    });
  }
  //product() là hàm lấy dữ liệu sản phẩm từ csd
  function product() {
    $.ajax({
      url: "action.php",
      method: "POST",
      data: { getProduct: 1 },
      success: function (data) {
        $("#get_product").html(data);
      },
    });
  }
  /*
	 khi người dùng nhấp vào danh mục, lấy id danh mục và hiện sản phẩm theo danh mục đó
	*/
  $("body").delegate(".category", "click", function (event) {
    $("#get_product").html("<h3>Loading...</h3>");
    event.preventDefault();
    var cid = $(this).attr("cid");

    $.ajax({
      url: "action.php",
      method: "POST",
      data: { get_seleted_Category: 1, cat_id: cid },
      success: function (data) {
        $("#get_product").html(data);
        if ($("body").width() < 480) {
          $("body").scrollTop(683);
        }
      },
    });
  });

  /*	
		hiển thị ds brand, khi nhấp vào thương hiệu, nhận được id thương hiệu và theo id brand thì hiển thị sản phẩm
	*/
  $("body").delegate(".selectBrand", "click", function (event) {
    //dùng delegate để lắng nghe sự kiện click
    event.preventDefault();
    $("#get_product").html("<h3>Loading...</h3>");
    var bid = $(this).attr("bid");

    $.ajax({
      url: "action.php",
      method: "POST",
      data: { selectBrand: 1, brand_id: bid },
      success: function (data) {
        //nếu thành công thì hiển thị dữ liệu
        $("#get_product").html(data);
        if ($("body").width() < 480) {
          $("body").scrollTop(683); //nếu màn hình nhỏ hơn 480px thì cuộn xuống 683px
        }
      },
    });
  });
  /*
		lấy chuỗi người dùng nhập match chuỗi keyword trong csdl 
	*/
  $("#search_btn").click(function () {
    $("#get_product").html("<h3>Loading...</h3>");
    var keyword = $("#search").val();
    if (keyword != "") {
      //nếu keyword khác rỗng thì
      $.ajax({
        url: "action.php",
        method: "POST",
        data: { search: 1, keyword: keyword },
        success: function (data) {
          $("#get_product").html(data);
          if ($("body").width() < 480) {
            $("body").scrollTop(683);
          }
        },
      });
    }
  });
  //end

  /*
		nếu bạn nhận được chuỗi login_success từ trang login.php có nghĩa là người dùng đã đăng nhập thành công và window.location là
được sử dụng để chuyển hướng người dùng từ trang chủ đến trang profile.php 
*/
  $("#login").on("submit", function (event) {
    event.preventDefault();
    $(".overlay").show();
    $.ajax({
      url: "login.php",
      method: "POST",
      data: $("#login").serialize(),
      success: function (data) {
        if (data == "login_success") {
          window.location.href = "profile.php";
        } else if (data == "cart_login") {
          window.location.href = "cart.php";
        } else {
          $("#e_msg").html(data);
          $(".overlay").hide();
        }
      },
    });
  });
  //end

  //Lấy thông tin người dùng trước khi thanh toán
  $("#signup_form").on("submit", function (event) {
    event.preventDefault();
    $(".overlay").show();
    $.ajax({
      url: "register.php",
      method: "POST",
      data: $("#signup_form").serialize(),
      success: function (data) {
        $(".overlay").hide();
        if (data == "register_success") {
          window.location.href = "cart.php";
        } else {
          $("#signup_msg").html(data);
        }
      },
    });
  });

  //Thêm sản phẩm vào giỏ hàng
  $("body").delegate("#product", "click", function (event) {
    var pid = $(this).attr("pid");
    event.preventDefault();
    $(".overlay").show();
    $.ajax({
      url: "action.php",
      method: "POST",
      data: { addToCart: 1, proId: pid },
      success: function (data) {
        count_item();
        getCartItem();
        $("#product_msg").html(data);
        $(".overlay").hide();
      },
    });
  });

  //Đếm số lượng sản phẩm trong giỏ hàng
  count_item();
  function count_item() {
    $.ajax({
      url: "action.php",
      method: "POST",
      data: { count_item: 1 },
      success: function (data) {
        $(".badge").html(data);
      },
    });
  }

  //đẩy sản phẩm trong giỏ hàng vào dropdown menu
  getCartItem();
  function getCartItem() {
    $.ajax({
      url: "action.php",
      method: "POST",
      data: { Common: 1, getCartItem: 1 },
      success: function (data) {
        $("#cart_product").html(data);
      },
    });
  }

  /*
    khi người dùng thay đổi số lượng, cập nhật tổng số tiền ngay lập tức bằng hàm keyup
	*/
  $("body").delegate(".qty", "keyup", function (event) {
    event.preventDefault();
    var row = $(this).parent().parent();
    var price = row.find(".price").val();
    var qty = row.find(".qty").val();
    if (isNaN(qty)) {
      qty = 1;
    }
    if (qty < 1) {
      qty = 1;
    }
    var total = price * qty;
    row.find(".total").val(total);
    var net_total = 0;
    $(".total").each(function () {
      net_total += $(this).val() - 0;
    });
    $(".net_total").html("Total : $ " + net_total);
  });

  /*
    lấy id sản phẩm của hàng đó và gửi nó đến action.php để thực hiện thao tác xóa sản phẩm
	*/
  $("body").delegate(".remove", "click", function (event) {
    var remove = $(this).parent().parent().parent();
    var remove_id = remove.find(".remove").attr("remove_id");
    $.ajax({
      url: "action.php",
      method: "POST",
      data: { removeItemFromCart: 1, rid: remove_id },
      success: function (data) {
        $("#cart_msg").html(data);
        checkOutDetails();
      },
    });
  });

  // cập nhật số lượng sản phẩm trong giỏ hàng
  $("body").delegate(".update", "click", function (event) {
    var update = $(this).parent().parent().parent();
    var update_id = update.find(".update").attr("update_id");
    var qty = update.find(".qty").val(); //
    $.ajax({
      url: "action.php",
      method: "POST",
      data: { updateCartItem: 1, update_id: update_id, qty: qty },
      success: function (data) {
        $("#cart_msg").html(data);
        checkOutDetails();
      },
    });
  });
  checkOutDetails();
  net_total();
  /*
    checkOutDetails được sử dụng để hiển thị sản phẩm giỏ hàng vào trang Cart.php
	*/
  function checkOutDetails() {
    $(".overlay").show();
    $.ajax({
      url: "action.php",
      method: "POST",
      data: { Common: 1, checkOutDetails: 1 },
      success: function (data) {
        $(".overlay").hide();
        $("#cart_checkout").html(data);
        net_total();
      },
    });
  }
  /*
		net_total là hàm được sử dụng để tính tổng số tiền của tất cả các sản phẩm trong giỏ hàng
	*/
  function net_total() {
    var net_total = 0;
    $(".qty").each(function () {
      var row = $(this).parent().parent();
      var price = row.find(".price").val();
      var total = price * $(this).val() - 0;
      row.find(".total").val(total);
    });
    $(".total").each(function () {
      net_total += $(this).val() - 0;
    });
    $(".net_total").html("Total : " + CURRENCY + " " + net_total);
  }

  //phân trang

  page();
  function page() {
    $.ajax({
      url: "action.php",
      method: "POST",
      data: { page: 1 },
      success: function (data) {
        $("#pageno").html(data);
      },
    });
  }
  $("body").delegate("#page", "click", function () {
    var pn = $(this).attr("page");
    $.ajax({
      url: "action.php",
      method: "POST",
      data: { getProduct: 1, setPage: 1, pageNumber: pn },
      success: function (data) {
        $("#get_product").html(data);
      },
    });
  });
});
