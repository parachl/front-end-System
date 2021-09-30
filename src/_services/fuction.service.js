


export const fuctionService = {
    genarateId,genarateId2digit
};


function genarateId(maxId) {
    let result = '';
  let num =  maxId.toString().length;
  if(num === 2 ){
    result = '0'+maxId;
  }else if(num === 1){
    result = '00'+maxId;
  }else if(num === 3){
      result = maxId;
  }
  return result;
}

function genarateId2digit(maxId) {
  let result = '';
let num =  maxId.toString().length;
if(num === 2 ){
  result = maxId;
}else if(num === 1){
  result = '0'+maxId;
}
return result;
}