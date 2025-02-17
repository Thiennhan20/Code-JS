//Nguyễn Thiện Nhân-2180605904
// Khai báo kiểu dữ liệu student
class Student {
    constructor(name, age, score1, score2) {
        this.name = name;
        this.age = age;
        this.score1 = score1;
        this.score2 = score2;
    }

    getAverage() {
        return (this.score1 + this.score2) / 2;
    }
}

// Tạo mảng gồm 4 student
const students = [
    new Student("An", 19, 8, 7),
    new Student("Bình", 17, 6, 5),
    new Student("Châu", 20, 9, 10),
    new Student("Dũng", 18, 7, 6)
];

// Sử dụng map để in ra xếp loại của từng sinh viên
const studentsClassification = students.map(student => {
    let avg = student.getAverage();
    let grade = avg >= 8 ? "Giỏi" : avg >= 6.5 ? "Khá" : "Trung bình";
    return `${student.name}: ${grade}`;
});
console.log("Xếp loại sinh viên:", studentsClassification);

// Sử dụng reduce để tính TBC điểm của SV trong lớp
const classAverage = students.reduce((sum, student) => sum + student.getAverage(), 0) / students.length;
console.log("Điểm trung bình cả lớp:", classAverage.toFixed(2));

// Sử dụng some để kiểm tra có sinh viên nào dưới 18 không?
const hasUnderageStudent = students.some(student => student.age < 18);
console.log("Có sinh viên nào dưới 18 không?", hasUnderageStudent ? "Có" : "Không");

// Sử dụng every để kiểm tra cả lớp có đầy đủ tên không?
const allHaveNames = students.every(student => student.name.trim() !== "");
console.log("Tất cả sinh viên có tên không?", allHaveNames ? "Có" : "Không");
