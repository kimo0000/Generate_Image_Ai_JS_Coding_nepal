const formSubmit = document.querySelector("form");
const galleryImg = document.querySelector(".content");
const modal = document.querySelector(".modal");

const OPENAI_API_KEY = `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`;

const generateIMgEl = (imgArray) => {
  console.log(imgArray);
  imgArray.forEach((imgObj, index) => {
    const imgCard = galleryImg.querySelectorAll(".box_image")[index];
    const imgEl = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector("a");

    console.log(imgObj);

    const generateImgAi = `data:image/jpeg;base64,${imgObj.b64_json}`;
    imgEl.src = generateImgAi;

    imgEl.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", generateImgAi);
      downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
    };
  });
};

const generateAIImg = async (inputEl, selectEl) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: inputEl,
          n: parseInt(selectEl),
          size: "512x512",
          response_format: "b64_json",
        }),
      }
    );

    if (!response.ok)
      throw new Error("this is a bad request, please try a gain");

    const { data } = await response.json();
    // console.log([...data]);
    generateIMgEl([...data]);

    // if() throw new Error('')
  } catch (error) {
    modal.innerText = error.message;
    modal.classList.add("show");
    setTimeout(() => {
      modal.innerText = "";
      modal.classList.remove("show");
    }, 3000);
  }
};

const generateImgLoading = (e) => {
  e.preventDefault();

  const inputEl = formSubmit.querySelector("input").value;
  const selectEl = formSubmit.querySelector("select").value;

  const imgLoad = Array.from(
    { length: selectEl },
    () =>
      `<div class="box_image loading">
                <img src="imgs/Spinner-1s-200px.svg" alt="Image">
                <a href="#">
                    <i class="fa-solid fa-download"></i>
                </a>
            </div>`
  ).join("");

  // console.log(imgLoad);
  galleryImg.innerHTML = imgLoad;
  generateAIImg(inputEl, selectEl);
};

formSubmit.addEventListener("submit", generateImgLoading);
