function EBS(info) {
  alert(info);
}

function insert() {
  let name = document.getElementById('addName').value;

  if (String(name).length > 0) {
    EBS(name);
  } else {
    EBS("Enter a workout!")
  }


}