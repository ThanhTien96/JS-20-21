// lớp đối tượng sinh viên
function student(id, fullName, email, dob, course, math, physic, chemistry) {
  this.studentId = id;
  this.fullName = fullName;
  this.email = email;
  this.dob = dob;
  this.course = course;
  this.math = math;
  this.physic = physic;
  this.chemistry = chemistry;

  this.calcGPA = function () {
    return (this.math + this.physic + this.chemistry) / 3;
  }
}

// Student.prototype.classify = function () {
//   console.log("classify student");
// };
