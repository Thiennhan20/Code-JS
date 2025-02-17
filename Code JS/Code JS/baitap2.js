//Nguyễn Thiện Nhân-2180605904
// Kiểm tra nếu chạy trong trình duyệt hay Node.js
const isBrowser = typeof window !== "undefined";

// Định nghĩa lớp StudentInfo (đổi tên để khác với baitap1.js)
class StudentInfo {
    constructor(fullName, birthYear, scoreMath, scoreEnglish) {
        this.fullName = fullName;
        this.birthYear = birthYear;
        this.scoreMath = scoreMath;
        this.scoreEnglish = scoreEnglish;
    }

    // Tính điểm trung bình
    getAverage() {
        return (this.scoreMath + this.scoreEnglish) / 2;
    }

    // Trả về độ tuổi
    getAge(currentYear = new Date().getFullYear()) {
        return currentYear - this.birthYear;
    }
}

// Hàm tạo Promise ngẫu nhiên
function createRandomPromise(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let randomNumber = Math.floor(Math.random() * 11);
            console.log(`Random Number (${delay}s):`, randomNumber);
            
            if (randomNumber % 2 === 0) {
                resolve(new StudentInfo("Nguyễn Văn A", 2005, 8, 7));
            } else {
                reject("Dữ liệu lỗi");
            }
        }, delay * 1000);
    });
}

// Tạo hai promise
const promise1 = createRandomPromise(2);
const promise2 = createRandomPromise(4);

// Sử dụng Promise.all
Promise.all([promise1, promise2])
    .then(results => {
        console.log("Lấy dữ liệu hoàn thành", results);
        if (isBrowser) {
            document.getElementById("output").innerText += "\nLấy dữ liệu hoàn thành: " + JSON.stringify(results, null, 2);
        }
    })
    .catch(error => {
        console.log("Lỗi trong Promise.all:", error);
    });

// Sử dụng Promise.race
Promise.race([promise1, promise2])
    .then(result => {
        console.log("Đã lấy được dữ liệu", result);
        if (isBrowser) {
            document.getElementById("output").innerText += "\nĐã lấy được dữ liệu: " + JSON.stringify(result, null, 2);
        }
    })
    .catch(error => {
        console.log("Lỗi trong Promise.race:", error);
    });
