// Hàm formatDate để định dạng ngày thành chuỗi như yêu cầu
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// Hàm sortObject để sắp xếp các đối tượng theo thứ tự alphabet
export function sortObject(obj: any): any {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}
