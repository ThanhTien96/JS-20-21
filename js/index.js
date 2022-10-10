/**
 * Project: Student Management (CRUD)
 * Features:
 *  + Create student
 *  + Read students
 *  + Delete student
 *  + Search student (id + name)
 *  + Update student
 *  + Validate form
 * Start project
 *  + (PM BA PO) write product requirements document (PRD)
 *  + design
 *  + phân rã lớp đối tượng
 *    (1 lớp SinhVien: maSV, tenSV, dob, email, khoá học, điểm toán, lý,hoá , tinhDiemTrungBinh)
 *  + UI => implement js
 *  + Testing (QC)
 *  + production
 */

// viết hàm tạo sinh viên ( creatStudent function)

// tạo 1 mảng chứa đối tượng student
var studentList = [];

async function createStudent() {

// lấy input từ UX:
var studentId = document.getElementById("txtMaSV").value;
var fullName = document.getElementById("txtTenSV").value;
var email = document.getElementById("txtEmail").value;
var dob = document.getElementById("txtNgaySinh").value;
var course = document.getElementById("khSV").value;
var math = +document.getElementById("txtDiemToan").value;
var physic = +document.getElementById("txtDiemLy").value;
var chemistry = +document.getElementById("txtDiemHoa").value;

// // 2 check mã sinh viên (id)
//   for (var i = 0; i < studentList.length; i++) {
//     if (studentList[i].studentId === studentId) return alert('Mã sinh viên đã tồn tại');
//   }

// 3. tạo object sinh viên mới
  var newStudent = new student(
    studentId,
    fullName,
    email,
    dob,
    course,
    math,
    physic,
    chemistry
  );

  var promise = await axios ({
    url: "https://6336fca465d1e8ef2677b3aa.mockapi.io/students",
    method: "POST",
    data: newStudent,
  });

  try {
    renderStudent();
  } catch (err) {
    console.log(err);
  }

    // axios ({
    //   url: "https://6336fca465d1e8ef2677b3aa.mockapi.io/students",
    //   method: "POST",
    //   data: newStudent,
    // }).then ( (res) => {
    //   getStudentList();
    // }).catch ( (err) => {
    //   console.log(err);
    // });


// // 4. push obj vào mảng
// studentList.push(newStudent);
// console.log(studentList);

// // 5. in danh sách sinh viên ra màn hình (render to HTML)
// renderStudent();

// // 6. luu danh sách sinh viên xuống kho lưu trữ web (local storage).
// setStudentList();

}

// viết hàm render ra giao diện

function renderStudent(data) {
  // kiểm tra nếu không truyền tham số thì render mạc định là studentList
  if (!data) data = studentList;

  // tạo biến hứng giá trị
  var tableHTML = '';

  // chạy vòng lặp in từng đứa sinh viên ra giao diện

  for (var i = 0; i < data.length; i++) {

    //tạo biến hứng giá trị studentList[thứ tự index]
    var currentStudent = data[i];

    // gán giá trị về cho biến tableHTML cứ mỗi vòng lặp biến sẽ sinh ra thêm 1 table sinh viên
    tableHTML += `<tr>
  <td>${currentStudent.studentId}</td>
  <td>${currentStudent.fullName}</td>
  <td>${currentStudent.email}</td>
  <td>${currentStudent.dob}</td>
  <td>${currentStudent.course}</td>
  <td>${currentStudent.calcGPA().toFixed(1)}</td>
  <td class="d-flex">
    <button onclick="deleteStudent('${currentStudent.studentId}')" class="btn btn-danger">Xoá</button>
    <button onclick="getUpdateStudent('${currentStudent.studentId}')" class="btn btn-info ml-1">Sửa</button>
  </td>
  </tr>`

  }

  // dom ra giao diện

  document.getElementById('tbodySinhVien').innerHTML = tableHTML;

}

// set data: luu xuong local Storage

function setStudentList() {
  // chuyển hàm và tất cả phương thức thành chuỗi
  var studentListJSON = JSON.stringify(studentList);

  // set data ở local storage trước khi set phải chuyển tất cả thành chuỗi thì mới lưu được

  // truyền vào cho nó 2 tham số: 1. tên lưu ở dưới local để lấy lên sử dung... 2. thứ muốn lưu
  localStorage.setItem('SL', studentListJSON);

}

// get data: lấy dữ liệu dưới local lên 

/**
trước khi render ra phải JSON.parse giải nén về định dạng cũ
 */

async function getStudentList() {

  var promise =  axios({
    url: "https://6336fca465d1e8ef2677b3aa.mockapi.io/students",
    method:"GET",
  });

  try {
    var response = await promise;
    studentList = mapData(response.data);
    renderStudent();
  }catch (err) {
    console.log(err);
  }


  
    // axios({
    //   url: "https://6336fca465d1e8ef2677b3aa.mockapi.io/students",
    //   method:"GET",
    // }).then ( (res) => {
    //   studentList = mapData(res.data)
    //   renderStudent();
    // }).catch( (err) => {
    //   console.log(err)
    // });

  // // 1. get data từ local từ tên đã lưu trước đó
  // var studentListJSON = localStorage.getItem('SL');

  // // 2. kiểm tra xem dưới local đã lưu gì chưa, nếu chưa là lần đầu chạy thì sẽ không cần get data:

  // if (!studentListJSON) return;

  // // 3. gán giá trị mới về cho mảng cũ studentList
  // studentList = mapData(JSON.parse(studentListJSON));
  // //map data: vì khi lưu xuống local tất cả định dạng và phương thức đều chuyển về chuỗi cần map data để sử dụng.

  // // render ra giao diện
  // renderStudent();

}

// map data: chuyển danh sách sinh vien cũ sang danh sách sinh viên mới

function mapData(studentListLocal) {

  // tạo 1 biến hứng giá trị biến cũ
  var result = [];

  // chạy vòng lặp duyệt qua mảng
  for (var i = 0; i < studentListLocal.length; i++) {

    // tạo 1 biến hứng giá trị trong mảng cũ;
    var oldStudent = studentListLocal[i];

    // mỗi lần lặp sẽ tạo ra 1 đối tượng sinh viên mới
    var newStudent = new student(
      oldStudent.studentId,
      oldStudent.fullName,
      oldStudent.email,
      oldStudent.dob,
      oldStudent.course,
      oldStudent.math,
      oldStudent.physic,
      oldStudent.chemistry,
    );
    // push vô mảng
    result.push(newStudent);
  }
  // trả kết quả
  return result;


}


// chạy hàm khi load trang. bắt sự kiện onload

window.onload = function () {
  
  // gọi hàm khi vừa load trang là chạy luôn
  getStudentList();
};

// tìm id: find By Id

function findStudentId(studentId) {
  // chuyền vào id để hàm tìm 

  // chạy vòng lặp duyệt qua mảng

  for (var i = 0; i < studentList.length; i++) {
    if (studentList[i].studentId === studentId) {
      return i;
    }

  }
  // nếu không tìm thấy sẽ trả về -1
  return -1;
}


// xóa sinh viên

function deleteStudent(studentId) {


  axios({
    url: "https://6336fca465d1e8ef2677b3aa.mockapi.io/students/" + studentId,
    method: "DELETE",
  }).then((res) => {
    getStudentList()
  }).catch( (err) => {
    console.log(err)
  });
  // // phải tìm id phần tử muốn xóa
  // var index = findStudentId(studentId);
  
  // // kiểm tra điều kiện nếu index = -1 thì alert ra 
  // if (index === -1) return alert('Mã sinh viên không tồn tại');

 

  // // còn xuống được dưới thì thỏa điều kiện và tiến hành xóa;
  // studentList.splice(index, 1);

  // // xóa luôn dưới local storage
  // setStudentList();

  // // xóa xong rồi render ra giao diện cho người dùng
  // renderStudent();

}


// search: tìm kiếm sinh viên

function searchStudent() {
  
  // dom tới input lấy giá trị

  var keyword = document.querySelector('#txtSearch').value.toLowerCase();

  // tạo mảng hứng kết quả
  var result = [];

  // chạy vòng lặp chạy qua danh sách sinh viên kiểm tra đúa nào thỏa điều kiện thì bỏ vào biến kết quả và sau đó render ra

  for (var i = 0; i < studentList.length; i++) {
    // tạo biến chứa giá trị id và name cho gọn code
    var studentId = studentList[i].studentId;
    var studentName = studentList[i].fullName.toLowerCase().trim();
    
    // tiến hành kiểm tra 
    if (studentId === keyword || studentName.includes(keyword)) {
      result.push(studentList[i])
    }
  }
  // gọi hàm render chay và chuyền tham số cho nó chạy mảng mới
  renderStudent(result);
}


// update : 2 ham

// 1. update phần 1: lấy thông tin sinh viên show lên form
function getUpdateStudent(studentId) {

  axios({
    url:"https://6336fca465d1e8ef2677b3aa.mockapi.io/students/" + studentId,
    method: "GET"
  }).then( (res) => {
    var student = res.data;
     // đổ thôn tin lên lại input
  document.getElementById("txtMaSV").value = student.studentId;
  document.getElementById("txtTenSV").value = student.fullName;
  document.getElementById("txtEmail").value = student.mail;
  document.getElementById("txtNgaySinh").value = student.dob;
  document.getElementById("khSV").value = student.course;
  document.getElementById("txtDiemToan").value = student.math;
  document.getElementById("txtDiemLy").value = student.physic;
  document.getElementById("txtDiemHoa").value = student.chemistry;

  // hiện nút sửa và ẩn nút thêm
  document.querySelector('#btnCreate').style.display = 'none';
  document.querySelector('#btnUpdate').style.display = 'inline-block';

  // ẩn ổ mã sinh viên không để người dùng sửa được bằng thuộc tính disabled

  document.querySelector('#txtMaSV').disabled = true;
  }).catch ((err) => {
    console.log(err);
  })



  // // kiểm tra vị tí id
  // var index = findStudentId(studentId);

  // // kiểm tra 
  // if (index === -1) return alert('Mã sinh viên không tồn tại !!!');

  // // di xuống đây thì lụm cái vị trí
  // var student = studentList[index];

 
}

// hàm update phần 2:

/**
 cho người dùng sửa thông tin trên form => nhấn nút lưu thay đổi  => chạy hàm update
 */
function updateStudent() {

  //lấy input:
  var studentId = document.getElementById("txtMaSV").value;
var fullName = document.getElementById("txtTenSV").value;
var email = document.getElementById("txtEmail").value;
var dob = document.getElementById("txtNgaySinh").value;
var course = document.getElementById("khSV").value;
var math = +document.getElementById("txtDiemToan").value;
var physic = +document.getElementById("txtDiemLy").value;
var chemistry = +document.getElementById("txtDiemHoa").value;

// // tìm vị trí index student cần cập nhật lại

// var index = findStudentId(studentId);

// // gán student tìm dc vào 1 biến mới

// var student = studentList[index];

// // cập nhật lại toàn bộ thuộc tính mới cho student
student.fullName = fullName;
student.email = email;
student.dob = dob;
student.course = course;
student.math = math;
student.physic = physic;
student.chemistry = chemistry;

 // new ra đối tượng mới
 var newStudent = new student(
  studentId,
  fullName,
  email,
  dob,
  course,
  math,
  physic,
  chemistry,
);

axios({
  url:"https://6336fca465d1e8ef2677b3aa.mockapi.io/students/" + studentId,
  method:"PUT",
  data: newStudent,
}).then( (res) => {
getStudentList()
  // mở lại input mã sinh viên
document.querySelector('#txtMaSV').disabled = false;

// reset lại toàn bộ giá trị input về ô trống,
document.querySelector('#btnReset').click();

// hiện lại nút thêm ẩn đi nút updat
document.querySelector('#btnUpdate').style.display = 'none';
document.querySelector('#btnCreate').style.display = 'block';
}).catch( (err) => {
  console.log(err);
});

  
// // render lên lại giao diện

// renderStudent();



}
