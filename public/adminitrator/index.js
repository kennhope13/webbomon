// slider
$(document).ready(function(){
  $("#btn-login").click(function(){
    var us = $("#txt_username").val();
    var pw = $("#txt_password").val();
    $.post("./login", {
        Email: us,
        Password: pw
    }, function (data) {
      console.log("data",data);
        if (data.userType == 0) {      
            window.location = `/index?email=${us}`;
        } else {
          window.location = `/admin?email=${us}`;
        }
    })
  })
  $("#home").click(function(){
      window.location="/index";
  })
  $("#home1").click(function(){
    window.location="/index1";
  })
  // createUser
  $("#btnSubmit-Signup").click(function(){
    var Email=$("#txtemail").val();
    var Password=$("#txtpassword").val();
    var Name=$("#txtname").val();
    var address=$("#txtaddress").val();
    var mobile=$("#txtmobile").val();
   var data = {Email:Email,Password:Password,Name:Name,address:address,mobile:mobile};
    // Gửi yêu cầu POST với dữ liệu FormData
    jQuery.ajax({
    url: './Register',
    data: data,
    cache: false,
    method: 'POST',
    type: 'POST',
    success: function (data) {
        if(data.result==1){
            window.location = "./login";
            alert("tao tai khoan thanh cong hay dang nhap");
        }else{
            alert("tao tai khoan that bai")
        }
    }
    });
});
$("#login-lay").click(function(){
  var token = getCookie("jwt");
    var data = { Token: token };
    console.log("data", data);
  jQuery.ajax({
      url: './logout',
      data: data,
      cache: false,
      method: 'POST',
      type: 'POST',
      success: function (data) {
          if(data.result==1){
              window.location = "./index1";
              alert("Logout account thanh cong");
          }else{
              alert("Logout account that bai");
          }
      }
  });

});
// show list user
$.post("./listuser", function (data) {
  console.log(data);
  if(data.result==1){
      data.userdata.forEach(function(dt,k){
          k=k+1;
          $("#listuser").append(`
              <tr>
                  <td class="text-center">`+k+`</td>
                  <td class="txt-oflo">`+dt.Name+`</td>
                  <td><span class="badge bg-success rounded-pill">`+dt.Active+`</span> </td>
                  <td><span class="text-success">`+dt.Email+`</span></td>
                  <td><span class="text-success">`+dt.mobile+`</span></td>
                  <td><a href="javascript:void(0)" class="text-inverse p-r-10" data-bs-toggle="tooltip" title="" data-original-title="Edit"><i class="ti-marker-alt"></i></a> <a class="Delete_User text-inverse" id="`+dt._id+`" title="" data-bs-toggle="tooltip" data-original-title="Delete"><i class="ti-trash"></i></a></td> 
              </tr>
          `)
      })
  }
});

// show list athors
$.post("./listauthor", function (data) {
  console.log(data);
  if(data.result==1){
      data.userdata.forEach(function(dt,k){
          k=k+1;
          $("#listauthor").append(`
            <tr>
                <td class="text-center">`+k+`</td>
                <td class="txt-oflo">`+dt.name+`</td>
                <td><span class="text-success">`+dt.email+`</span></td>
                <td><span class="text-success">`+dt.dateOfBirth+`</span></td>
                <td class="txt-oflo"><span><img class="avatar" src="./upload/avatar.png" alt=""></span></td>
                <td><span class="text-success">`+dt.createdAt+`</span></td>
                <td><span class="text-success">`+dt.updatedAt+`</span></td>
                <td><a href="javascript:void(0)" class="text-inverse p-r-10" data-bs-toggle="tooltip" title="" data-original-title="Edit"><i class="ti-marker-alt"></i></a> <a class="text-inverse" title="" data-bs-toggle="tooltip" data-original-title="Delete"><i class="ti-trash"></i></a></td> 
            </tr> 

          `)
      })
  }
});
// upload file
$("#btnUploadImage").click(function(){
  var data = new FormData();
  jQuery.each(jQuery('#txtFileImage')[0].files, function(i, file) {
      data.append('avatar', file);
  });

  jQuery.ajax({
      url: './uploadfile',
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      type: 'POST', // For jQuery < 1.9
      success: function(data){
          if(data.result==1){
              $("#imgProduct").attr("src","upload/" + data.info.filename);
              $("#hid_avt").attr("value","upload/" + data.info.filename);
          }else{
              alert(data.message);
          }
      }
  });
});

//add data product database
$("#btnSubmit_addArticle").click(function(){
  var data = new FormData();

  data.append("article_name", $("#txtname").val());
  // data.append("category_id", $("#select_categories").val());
  data.append("images", $("#hid_avt").val());
  data.append("describe", $("#textarea").val());
  // Gửi yêu cầu POST với dữ liệu FormData
  jQuery.ajax({
  url: './addArticle',
  data: data,
  cache: false,
  contentType: false,
  processData: false,
  method: 'POST',
  type: 'POST',
  success: function (data) {
      window.location = "./index";
  }
  });
});
})
let slideIndex = 1;
//showSlides(slideIndex);
showSlides();
function getTokenByUser(){
  $.post("./get-user-byToken", function(data){
    console.log("data token", data);
  })
}
// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}


// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slideIndex++;

  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 3000);
}
