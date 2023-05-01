var imageCounter = 1;
/* called when image is clicked */

function dumpDB() {
  var url = "http://138.68.25.50:11751/query?op=dump";
  //alert(url);
  function reqListener() {
    // PGH stuff here

    var dumpString = this.responseText;
    var tableObj = JSON.parse(dumpString);


    // alert("length = " + tableObj.length);
    for (r = 0; r < tableObj.length; r++) { //1st image is in INDEX 0 <-REMEMBER THIS??!!?!
      var entireImgDivHold = document.createElement("div");
      var imgDiv = document.createElement("div");
      var img = document.createElement("img");
      var labelBox = document.createElement("div");

      imgDiv.id = "imageContainer" + imageCounter++;
      imgDiv.className = "imageContainer";
      img.id = "uploadImage";
      var source = "http://138.68.25.50:11751/" + tableObj[r].fileName;
      img.src = source;

      fadeImage(img);

      //        labelBox.id = imgDiv.id + textParse.textContent;
      labelBox.className = "labelBox";
      labelBox.id = imgDiv.id + "labelBox";

      var divInput = document.createElement("div");
      var addLabelBox = document.createElement("input");
      var addButton = document.createElement("button");

      divInput.className = "inputLabelBox";
      divInput.id = imgDiv.id + "inputLabelBox";

      addLabelBox.placeholder = "Add label here...";
      addLabelBox.type = "text";
      addLabelBox.id = imgDiv.id + "AddLabelBox";
      addLabelBox.className = "AddLabelBox";

      var loaderDiv = document.createElement("div");
      loaderDiv.className = "loaderDiv";
      loaderDiv.id = imgDiv.id + "loaderDiv";

      var overlayImage = document.createElement("img");
      var overlayImageDiv = document.createElement("div");

      overlayImage.src = "./photobooth/optionsTriangle.png";
      overlayImage.className = "overlayImage";
      overlayImage.id = imgDiv.id + "overlayImage";

      overlayImageDiv.id = imgDiv.id + "overlayImageDiv";
      overlayImageDiv.className = "overlayImageDiv";

      var overlayPanel = document.createElement("div");
      var changeTagsBox = document.createElement("text");
      var addToFavoritesBox = document.createElement("text");
      var threeDotsImage = document.createElement("img");

      overlayPanel.className = "overlayPanel";
      overlayPanel.id = imgDiv.id + "overlayPanel";
      changeTagsBox.id = imgDiv.id + "changeTagsBox";
      addToFavoritesBox.id = imgDiv.id + "addToFavoritesBox";
      threeDotsImage.id = imgDiv.id + "threeDotsImage";

      changeTagsBox.className = "changeTagsBox";
      addToFavoritesBox.className = "addToFavoritesBox";
      threeDotsImage.className = "threeDotsImage";

      changeTagsBox.onclick = function() {
        displayChangeTags(labelBox, addLabelBox)
      };

      overlayImage.onclick = function() {
        changeOverlay(overlayImage.id, overlayPanel.id)
      }; // This is how to set it to a function without having it be called

      changeTagsBox.textContent = "change tags";
      addToFavoritesBox.textContent = "add to favorites";
      threeDotsImage.src = "./photobooth/optionsTriangle.png";
      threeDotsImage.onclick = function() {
        changeOverlayExpand(overlayImage.id, overlayPanel.id, imgDiv.id)
      };

      overlayPanel.appendChild(changeTagsBox);
      overlayPanel.appendChild(addToFavoritesBox);
      overlayPanel.appendChild(threeDotsImage);

      addButton.id = imgDiv.id + "AddButton";
      addButton.textContent = "Add";
      addButton.className = "AddButton";
      divInput.appendChild(addLabelBox);
      divInput.appendChild(addButton);
      addButton.onclick = function() {

        addLabels(tableObj[r].fileName, imgDiv.id)
      };

      getLabels(tableObj[r].fileName, labelBox);

      // Upload the item+label into the container and the container onto the webpage
      overlayImageDiv.appendChild(overlayImage);

      imgDiv.appendChild(overlayPanel);
      imgDiv.appendChild(overlayImageDiv);
      imgDiv.appendChild(img);
      imgDiv.appendChild(labelBox);
      imgDiv.appendChild(divInput);
      entireImgDivHold.appendChild(imgDiv);
      uploadItems.appendChild(entireImgDivHold);
      unFadeImage(img);

      // alert("imageCounter" + imageCounter);
    }
    //{"fileName":"eagle.jpg","labels":"DYING,DEATH,","favorite":0}
  }

  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", url); // Type Of Request, Who we request from
  // Get is the app.get, it will use that to call on it
  // URL is a string we create
  oReq.send();
}

function getLabels(imgName, labelBox) {
  var url = "http://138.68.25.50:11751/query?img=" + imgName + '&op=obtain'; // Change JPG
  console.log("in getLabels");
  // becomes method of request object oReq
  function reqListener() {
    var pgh = labelBox;
    var stringSplit = this.responseText.split(',');

    for (i = 0; i < stringSplit.length; i++) {
      if (stringSplit[i] == '')
        continue;
      var divBox = document.createElement("div");
      divBox.className = "labelItem";
      divBox.id = labelBox.id + "labelItem" + (i + 1);

      var deleteImageDiv = document.createElement("div");
      deleteImageDiv.className = "removeLabelDiv";
      deleteImageDiv.id = "removeLabelDiv" + (i + 1);

      // We need to go in here and select every removeLabelDiv, so we can use the class to parse and then rotate through i

      var deleteImageLabel = document.createElement("img");
      deleteImageLabel.src = "./photobooth/removeTagButton.png";
      deleteImageLabel.id = "removeLabel" + (i + 1);
      deleteImageLabel.className = "removeLabel";

      deleteImageDiv.appendChild(deleteImageLabel);

      var newLabel = document.createTextNode(stringSplit[i]);
      newLabel.id = "labelProperty" + (i + 1);
      newLabel.className = "labelProperty";

      function createDeleteLabels(currentDivID, imageLabel, labelName) {
        return function() {
          var url = "http://138.68.25.50:11751/query?img=" + imageLabel + '&op=delete&label=' + labelName; // Change JPG
          // alert(url);
          //    alert(currentDivID);
          var deleteElement = document.getElementById(currentDivID);
          deleteElement.parentNode.removeChild(deleteElement);

          function reqListener() {

          }

          var oReq = new XMLHttpRequest();
          oReq.addEventListener("load", reqListener);
          oReq.open("GET", url); // Type Of Request, Who we request from
          // Get is the app.get, it will use that to call on it
          // URL is a string we create
          oReq.send();

        };
      }

      divBox.onclick = createDeleteLabels(labelBox.id + "labelItem" + (i + 1), imgName, stringSplit[i]);

      divBox.appendChild(deleteImageDiv);
      divBox.appendChild(newLabel);
      pgh.appendChild(divBox);
    }

  }

  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", url); // Type Of Request, Who we request from
  // Get is the app.get, it will use that to call on it
  // URL is a string we create
  console.log("Test");
  oReq.send();
}

function uploadFile() {
  var url = "http://138.68.25.50:11751";

  // where we find the file handle
  var selectedFile = document.getElementById('fileSelector').files[0];
  var formData = new FormData();
  // stick the file into the form
  formData.append("userfile", selectedFile);

  // more or less a standard http request
  var oReq = new XMLHttpRequest();
  // POST requests contain data in the body
  // the "true" is the default for the third param, so
  // it is often omitted; it means do the upload
  // asynchornously, that is, using a callback instead
  // of blocking until the operation is completed.
  oReq.open("POST", url, false);
  oReq.onload = function() {
    // the response, in case we want to look at it
    console.log(oReq.responseText);
  }
  oReq.send(formData);
}


function readFile() {
  var selectedFile = document.getElementById('fileSelector').files[0];
  var image = document.getElementById('theImage');

  var fr = new FileReader();
  // anonymous callback uses file as image source
  fr.onload = function() {
    image.src = fr.result;
  };
  fr.readAsDataURL(selectedFile); // begin reading
}

function clicked() // Test function
{
  window.location.href = "http://138.68.25.50:11751/weatherApp.html";
}

function clickedUpload() {
  var selectedFile = document.getElementById('fileSelector').files[0];
  var image = document.getElementById('uploadBar');

  var fr = new FileReader();
  // anonymous callback uses file as image source
  fr.onload = function() {
    image.src = fr.result;
  };
  fr.readAsDataURL(selectedFile); // begin reading
}


function clickedFavorites() {
  window.alert("Favorite clicked");
}

function submitSearch() {
  if (e.keyCode == 13) {

    window.alert("Enter Pressed");
    var text = document.getElementById("searchBox").value;
    window.alert(text);
    return false;
  }
}

function selectFileName() {
  var fileName = document.getElementById("fileName");

  var file = document.getElementById('fileSelector');
  var extract = document.createTextNode(file.value);
  var sendText = document.createTextNode(extract.textContent.replace("C:\\fakepath\\", ""));
  if (sendText.nodeValue == "") {
    fileName.innerHTML = "No file selected";
    return;
  }

  fileName.innerHTML = "";
  fileName.appendChild(sendText);
}

function addLabels(imgName, label) {
  var labelQuery = document.getElementById(label + "AddLabelBox").value;
  var url = "http://138.68.25.50:11751/query?img=" + imgName + '&op=add&label=' + labelQuery; // Change from JPG

  function reqListener() {

    var pgh = document.getElementById(label + "labelBox");

    var divBox = document.createElement("div");
    divBox.className = "labelItem";
    /** HERE IT IS IMPORTANT DIVBOX ID NEEDS TO BE HERE FOR THE ADD */

    var deleteImageLabel = document.createElement("img");
    deleteImageLabel.src = "./photobooth/removeTagButton.png";
    deleteImageLabel.id = "removeLabel";

    var newLabel = document.createTextNode(labelQuery);

    divBox.appendChild(deleteImageLabel);
    divBox.appendChild(newLabel);
    pgh.appendChild(divBox);

  }


  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", url); // Type Of Request, Who we request from
  // Get is the app.get, it will use that to call on it
  // URL is a string we create
  oReq.send();
}

function loadItem() // We can probably have a div that appends and then inside of that div do another append
{
  // console.log("HELLOO?!?!!!!!!~~~~~~~~");
  //    var incrementCounter = new Counter();
  if (uploadItems.childElementCount >= 12) {
    alert("No more items can be appended. Please finish processing your photos.");
    return;
  }

  // uploadFile();
  var entireImgDivHold = document.createElement("div");
  entireImgDivHold.className = "entireImgDivHold";
  entireImgDivHold.id = "entireImgDivHold" + imageCounter;
  var imgDiv = document.createElement("div");
  var img = document.createElement("img");
  var labelBox = document.createElement("div");
  var url = "http://138.68.25.50:11751";
  // where we find the file handle
  var selectedFile = document.getElementById('fileSelector').files[0];
  var selectedFileName = document.getElementById('fileSelector').files[0].name;
  var formData = new FormData();
  // stick the file into the form
  formData.append("userfile", selectedFile);
  console.log("selectedFile = " + selectedFileName);
  imgDiv.id = "imageContainer" + imageCounter++;
  imgDiv.className = "imageContainer";
  img.id = "uploadImage";
  labelBox.className = "labelBox";
  labelBox.id = imgDiv.id + "labelBox";

  function uploadCallback() {

    var pgh = labelBox;
    var labels = this.responseText;
    var stringSplit = labels.split(',');

    for (i = 0; i < stringSplit.length; i++) {
      if (stringSplit[i] == '')
        continue;
      var divBox = document.createElement("div");
      divBox.className = "labelItem";
      divBox.id = pgh.id + "labelItem" + (i + 1);

      var deleteImageDiv = document.createElement("div");
      deleteImageDiv.className = "removeLabelDiv";
      deleteImageDiv.id = "removeLabelDiv" + (i + 1);

      var deleteImageLabel = document.createElement("img");
      deleteImageLabel.src = "./photobooth/removeTagButton.png";
      deleteImageLabel.className = "removeLabel";

      deleteImageDiv.appendChild(deleteImageLabel);

      var newLabel = document.createTextNode(stringSplit[i]);
      newLabel.id = "labelProperty" + (i + 1);
      newLabel.className = "labelProperty";

      function createDeleteLabels(currentDivID, imageLabel, labelName) {
        return function() {
          var url = "http://138.68.25.50:11751/query?img=" + imageLabel + '&op=delete&label=' + labelName; // Change JPG
          // alert(url);
          //    alert(currentDivID);
          var deleteElement = document.getElementById(currentDivID);
          deleteElement.parentNode.removeChild(deleteElement);

          function reqListener() {

          }

          var oReq = new XMLHttpRequest();
          oReq.addEventListener("load", reqListener);
          oReq.open("GET", url); // Type Of Request, Who we request from
          // Get is the app.get, it will use that to call on it
          // URL is a string we create
          oReq.send();

        };
      }

      divBox.onclick = createDeleteLabels(labelBox.id + "labelItem" + (i + 1), selectedFileName, stringSplit[i]);

      divBox.appendChild(deleteImageDiv);
      divBox.appendChild(newLabel);
      pgh.appendChild(divBox);
    }
  }

  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", uploadCallback);
  oReq.open("POST", url, true, uploadCallback);
  oReq.send(formData);



  /* These lines up until textParse are used to get just the eagle part */
  var file = document.getElementById('fileSelector');
  var extract = document.createTextNode(file.value);
  var sendText = document.createTextNode(extract.textContent.replace("C:\\fakepath\\", ""));
  var typeSplit = sendText.textContent.split(".");
  // alert(typeSplit[0] + "." + typeSplit[1]);
  var textParse = document.createTextNode(sendText.textContent.replace("." + typeSplit[0], "")); // Change .jpg
  // alert(textParse.textContent);

  if (sendText.nodeValue == "") {
    fileName.innerHTML = "No file selected";
    return;
  }

  var fr = new FileReader(); // anonymous callback uses file as image source
  fr.onload = function() {

    // First check to see that we have enough space per file.

    /* Create an image and labelbox and store it inside of a box */

    
    img.src = fr.result;

    fadeImage(img);

    //labelBox.id = imgDiv.id + textParse.textContent;
    

    var divInput = document.createElement("div");
    var addLabelBox = document.createElement("input");
    var addButton = document.createElement("button");

    divInput.className = "inputLabelBox";
    divInput.id = imgDiv.id + "inputLabelBox";

    addLabelBox.placeholder = "Add label here...";
    addLabelBox.type = "text";
    addLabelBox.id = imgDiv.id + "AddLabelBox";
    addLabelBox.className = "AddLabelBox";

    var loaderDiv = document.createElement("div");
    loaderDiv.className = "loaderDiv";
    loaderDiv.id = imgDiv.id + "loaderDiv";

    var overlayImage = document.createElement("img");
    var overlayImageDiv = document.createElement("div");

    overlayImage.src = "./photobooth/optionsTriangle.png";
    overlayImage.className = "overlayImage";
    overlayImage.id = imgDiv.id + "overlayImage";

    overlayImageDiv.id = imgDiv.id + "overlayImageDiv";
    overlayImageDiv.className = "overlayImageDiv";

    var overlayPanel = document.createElement("div");
    var changeTagsBox = document.createElement("text");
    var addToFavoritesBox = document.createElement("text");
    var threeDotsImage = document.createElement("img");

    overlayPanel.className = "overlayPanel";
    overlayPanel.id = imgDiv.id + "overlayPanel";
    changeTagsBox.id = imgDiv.id + "changeTagsBox";
    addToFavoritesBox.id = imgDiv.id + "addToFavoritesBox";
    threeDotsImage.id = imgDiv.id + "threeDotsImage";

    changeTagsBox.className = "changeTagsBox";
    addToFavoritesBox.className = "addToFavoritesBox";
    threeDotsImage.className = "threeDotsImage";

    changeTagsBox.onclick = function() {
      displayChangeTags(labelBox, addLabelBox)
    };

    overlayImage.onclick = function() {
      changeOverlay(overlayImage.id, overlayPanel.id)
    }; // This is how to set it to a function without having it be called

    changeTagsBox.textContent = "change tags";
    addToFavoritesBox.textContent = "add to favorites";
    threeDotsImage.src = "./photobooth/optionsTriangle.png";
    threeDotsImage.onclick = function() {
      changeOverlayExpand(overlayImage.id, overlayPanel.id, imgDiv.id)
    };

    overlayPanel.appendChild(changeTagsBox);
    overlayPanel.appendChild(addToFavoritesBox);
    overlayPanel.appendChild(threeDotsImage);

    addButton.id = imgDiv.id + "AddButton";
    addButton.textContent = "Add";
    addButton.className = "AddButton";
    divInput.appendChild(addLabelBox);
    divInput.appendChild(addButton);
    addButton.onclick = function() {
      addLabels(selectedFileName, imgDiv.id)
    };
      

    // setTimeout(function(), 3000);

    // Upload the item+label into the container and the container onto the webpage
    overlayImageDiv.appendChild(overlayImage);

    imgDiv.appendChild(overlayPanel);
    imgDiv.appendChild(overlayImageDiv);
    imgDiv.appendChild(img);
    imgDiv.appendChild(labelBox);
    imgDiv.appendChild(divInput);
    entireImgDivHold.appendChild(imgDiv);
    uploadItems.appendChild(entireImgDivHold);
    unFadeImage(img);

    // getLabels(textParse.textContent, labelBox);
  };

  //~~~~~~!!!~~~~~~~~


  fr.readAsDataURL(selectedFile); // begin reading
}

function displayChangeTags(labelBox) // We have to pass in the labels here not the box, so change this when we have get label correct
{
  var displayDelete = document.getElementById(labelBox.id);
  displayDelete.style.display = "inline-flex";
}

function changeOverlay(overlayImage, overlayPanel) {
  var overlayImageChange = document.getElementById(overlayImage);
  var overlayPanelChange = document.getElementById(overlayPanel);
  overlayImageChange.style.display = "none";
  overlayPanelChange.style.display = "inline-flex";

}

function changeOverlayExpand(overlayImageID, overlayPanelID, imgDivID) {
  var overlayImageChange = document.getElementById(overlayImageID);
  var overlayPanelChange = document.getElementById(overlayPanelID);

  var imageContainerHover = document.getElementById(imgDivID);
  overlayImageChange.style.display = "";
  overlayImageChange.style.position = "absolute";
  overlayImageChange.style.right = "-2px";
  overlayImageChange.style.bottom = "-2px";
  overlayImageChange.style.height = "20%";
  overlayImageChange.style.width = "20%";
  overlayPanelChange.style.display = "none";
}

function fadeImage(img) // Uncomment the lines below for original
{
  img.style.opacity = 0.5; // This is all that's required to fade
}


function unFadeImage(img) // Pass in the image that needs to be unfaded
{
  img.style.opacity = 1.0;
}

function focusBox() // Put the focus on the searchbox
{
  document.getElementById("searchBox").focus();
}

function filterSearch() {
  var keyword = document.getElementById("searchBox").value;
  // alert("called filterSrch Btn. keyword = " + keyword);
    if(keyword.textContent == "" && keyword.onkeyup)
    {
        clearSearch();
    }

  var url = "http://138.68.25.50:11751/query?op=filter&label=" + keyword;
  // alert(url);

  function filterReqListener() {
    var filterString = this.responseText;
    // alert(filterString);
    var filterArray = JSON.parse(filterString);

    // alert("length = " + filterArray.length);

    //remove all images from browser
    var uploadItems = document.getElementById("uploadItems");
    while (uploadItems.firstChild) {
      uploadItems.removeChild(uploadItems.firstChild);
    }

    //add filtered images I THINK THIS WILL WORK AFTER YOU DELETE IMAGES??
    var imageCounter = 1;

    for (r = 0; r < filterArray.length; r++) {
      var entireImgDivHold = document.createElement("div");
      var imgDiv = document.createElement("div");
      var img = document.createElement("img");
      var labelBox = document.createElement("div");

      imgDiv.id = "imageContainer" + imageCounter++;
      imgDiv.className = "imageContainer";
      img.id = "uploadImage";
      var source = "http://138.68.25.50:11751/" + filterArray[r].fileName;
      img.src = source;

      fadeImage(img);

      //        labelBox.id = imgDiv.id + textParse.textContent;
      labelBox.className = "labelBox";
      labelBox.id = imgDiv.id + "labelBox";

      var divInput = document.createElement("div");
      var addLabelBox = document.createElement("input");
      var addButton = document.createElement("button");

      divInput.className = "inputLabelBox";
      divInput.id = imgDiv.id + "inputLabelBox";

      addLabelBox.placeholder = "Add label here...";
      addLabelBox.type = "text";
      addLabelBox.id = imgDiv.id + "AddLabelBox";
      addLabelBox.className = "AddLabelBox";

      var loaderDiv = document.createElement("div");
      loaderDiv.className = "loaderDiv";
      loaderDiv.id = imgDiv.id + "loaderDiv";

      var overlayImage = document.createElement("img");
      var overlayImageDiv = document.createElement("div");

      overlayImage.src = "./photobooth/optionsTriangle.png";
      overlayImage.className = "overlayImage";
      overlayImage.id = imgDiv.id + "overlayImage";

      overlayImageDiv.id = imgDiv.id + "overlayImageDiv";
      overlayImageDiv.className = "overlayImageDiv";

      var overlayPanel = document.createElement("div");
      var changeTagsBox = document.createElement("text");
      var addToFavoritesBox = document.createElement("text");
      var threeDotsImage = document.createElement("img");

      overlayPanel.className = "overlayPanel";
      overlayPanel.id = imgDiv.id + "overlayPanel";
      changeTagsBox.id = imgDiv.id + "changeTagsBox";
      addToFavoritesBox.id = imgDiv.id + "addToFavoritesBox";
      threeDotsImage.id = imgDiv.id + "threeDotsImage";

      changeTagsBox.className = "changeTagsBox";
      addToFavoritesBox.className = "addToFavoritesBox";
      threeDotsImage.className = "threeDotsImage";

      changeTagsBox.onclick = function() {
        displayChangeTags(labelBox, addLabelBox)
      };

      overlayImage.onclick = function() {
        changeOverlay(overlayImage.id, overlayPanel.id)
      }; // This is how to set it to a function without having it be called

      changeTagsBox.textContent = "change tags";
      addToFavoritesBox.textContent = "add to favorites";
      threeDotsImage.src = "./photobooth/optionsTriangle.png";
      threeDotsImage.onclick = function() {
        changeOverlayExpand(overlayImage.id, overlayPanel.id, imgDiv.id)
      };

      overlayPanel.appendChild(changeTagsBox);
      overlayPanel.appendChild(addToFavoritesBox);
      overlayPanel.appendChild(threeDotsImage);

      addButton.id = imgDiv.id + "AddButton";
      addButton.textContent = "Add";
      addButton.className = "AddButton";
      divInput.appendChild(addLabelBox);
      divInput.appendChild(addButton);
      addButton.onclick = function() {

        addLabels(filterArray[r].fileName, imgDiv.id)
      };

      getLabels(filterArray[r].fileName, labelBox);

      // Upload the item+label into the container and the container onto the webpage
      overlayImageDiv.appendChild(overlayImage);

      imgDiv.appendChild(overlayPanel);
      imgDiv.appendChild(overlayImageDiv);
      imgDiv.appendChild(img);
      imgDiv.appendChild(labelBox);
      imgDiv.appendChild(divInput);
      entireImgDivHold.appendChild(imgDiv);
      uploadItems.appendChild(entireImgDivHold);
      unFadeImage(img);

      // alert("imageCounter" + imageCounter);
      // }
    }
  }
  var fReq = new XMLHttpRequest();
  fReq.addEventListener("load", filterReqListener);
  fReq.open("GET", url); // Type Of Request, Who we request from
  fReq.send();

}

function clearSearch() {
  var textBoxClear = document.getElementById("searchBox");
    textBoxClear.value = "";
  var uploadItems = document.getElementById("uploadItems");
  while (uploadItems.firstChild) {
    uploadItems.removeChild(uploadItems.firstChild);
  }
  dumpDB();
}
