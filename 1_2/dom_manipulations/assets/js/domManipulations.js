(function () {

  const singleSquare = document.getElementById("square__single");
  if (singleSquare) {
    // 1
    document.querySelectorAll(".hide__dn").forEach(
      btn => btn.addEventListener("click", () => singleSquare.style.display = "none")
    );
    document.querySelectorAll(".hide__remove_node").forEach(
      btn => btn.addEventListener("click", () => singleSquare.remove())
    );
    document.querySelectorAll(".hide__hidden_class").forEach(
      btn => btn.addEventListener("click", () => singleSquare.classList.add("hidden"))
    );

    // 2
    document.querySelectorAll(".toggle__square").forEach(
      btn => btn.addEventListener("click", () => singleSquare.classList.toggle("hidden"))
    );
  }

  // 3
  document.querySelectorAll(".hide__all_squares").forEach(
    btn => btn.addEventListener("click", () =>
      document.querySelectorAll(".square__to_hide").forEach(el => el.classList.toggle("hidden")))
  );

  // 4 
  document.querySelectorAll(".select__items-btn").forEach(btn => {
    const inputSelector = btn.closest(".select__items-form")?.querySelector(".select__items-input");
    inputSelector && btn.addEventListener("click", (e) => {
      e.preventDefault();
      const selector = inputSelector.value;
      if (selector == "" || selector.includes(" ")) {
        return;
      }
      document.querySelectorAll(inputSelector.value).forEach(el => el.classList.toggle("hidden"));
    });
  });

  // 5 
  document.querySelectorAll(".square__once__click").forEach(square =>
    square.addEventListener("click", function () {
      alert("Привіт");
      square.addEventListener("click", function () {
        square.classList.add("hidden");
      })
    }, { once: true })
  );

  // 6
  document.querySelectorAll(".hover__to__show").forEach(toggler => {
    const toShow = toggler.closest("div")?.querySelector(".show__on__hover");
    if (toShow) {
      toggler.addEventListener("mouseenter", () => {
        toShow.classList.remove("hidden");
      })
      toggler.addEventListener("mouseout", () => {
        toShow.classList.add("hidden");
      });
    }
  });

  // 7
  document.querySelectorAll(".focus__to__show").forEach(toggler => {
    const toShow = toggler.closest("div")?.querySelector(".show__on__focus");
    if (toShow) {
      toggler.addEventListener("focusin", () => {
        toShow.classList.remove("hidden");
      });
      toggler.addEventListener("focusout", () => {
        toShow.classList.add("hidden");
      });
      toggler.addEventListener("input", () => {
        if (toggler.value == "") {
          toShow.classList.remove("hidden");
        } else if (!toShow.classList.contains("hidden")) {
          toShow.classList.add("hidden");
        }
      });
    }
  });

  // 8
  document.querySelectorAll(".dynamic__img-submit").forEach(btn => {
    const view = btn.closest("div")?.querySelector(".dynamic__img-view");
    const input = btn.closest("div")?.querySelector(".dynamic__img-input");
    view && input && btn.addEventListener("click", e => {
      e.preventDefault();
      view.src = input.value.trim();
    });
  });

  // 9
  document.querySelectorAll(".img__urls-btn").forEach(btn => {
    const textarea = btn.closest("div")?.querySelector(".img__urls-textarea");
    const imgTable = btn.closest("div")?.querySelector(".img__urls-table");
    btn.addEventListener("click", e => {
      e.preventDefault();
      textarea.value
        .split("\n")
        .forEach(url => {
          if (url.trim() == "") return;
          const img = document.createElement("img");
          img.src = url.trim();
          imgTable.append(img);
        });
    });
  })

  // 10 
  document.addEventListener("mousemove", e => {
    document.querySelectorAll(".insert__mouse-x").forEach(el => el.innerText = e.clientX);
    document.querySelectorAll(".insert__mouse-y").forEach(el => el.innerText = e.clientY);
  });

  // 11
  const lang = navigator.language;
  document.querySelectorAll(".insert__language").forEach(langEl => langEl.innerText = lang);

  // 12
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      document.querySelectorAll(".insert__latitude").forEach(
        el => el.innerText = position.coords.latitude
      );
      document.querySelectorAll(".insert__longtitude").forEach(
        el => el.innerText = position.coords.longitude
      );
    }, () => {
      document.querySelectorAll(".insert__latitude").forEach(
        el => el.innerText = "error"
      );
      document.querySelectorAll(".insert__longtitude").forEach(
        el => el.innerText = "error"
      );
    });
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }

  // 13
  document.querySelectorAll(".input__manual").forEach(input => {
    input.getValue = function () {
      return this.querySelector(".input__manual-inner").innerText;
    }
    input.addEventListener("click", function () {
      focusBlockInput(input);
      unfocusAllBlockInputs(input);
    })
  });
  document.addEventListener("click", e => {
    if (!e.target.classList.contains("input__manual")) {
      unfocusAllBlockInputs();
    }
  });

  document.querySelectorAll(".input__localstorage").forEach(
    input => setUpStoredInput(input, localStorage.getItem.bind(localStorage), localStorage.setItem.bind(localStorage)));
  document.querySelectorAll(".input__sessionstorage").forEach(
    input => setUpStoredInput(input, sessionStorage.getItem.bind(sessionStorage), sessionStorage.setItem.bind(sessionStorage)));
  document.querySelectorAll(".input__cookies").forEach(
    input => setUpStoredInput(input, getItemFromCookie, setItemToCookie));

  function modifyBlockInput(input, e) {
    e.preventDefault();
    const inputZone = input.querySelector(".input__manual-inner");
    if ([...e.key].length == 1) { // space
      inputZone.innerHTML += e.key == " " ? "&#160;" : e.key;
      input.storeValue();
    } else {
      switch (e.key) {
        case "Backspace":
          inputZone.innerText = inputZone.innerText.slice(0, -1);
          input.storeValue();
          break;
        case "Tab":
          inputZone.innerHTML += "&#160;".repeat(4);
          input.storeValue();
          break;
        default:
          console.log(`Unknown key ${e.key}`);
          break;
      }
    }
  }
  function unfocusAllBlockInputs(except = null) {
    document.querySelectorAll(".input__manual.focus").forEach(input => {
      if (except == null || except != input) {
        input.classList.remove("focus");
        document.removeEventListener("keydown", input.keyDownListener);
      }
    });
  }
  function focusBlockInput(input) {
    if (!input.classList.contains("focus")) {
      input.classList.add("focus");
      input.keyDownListener = e => modifyBlockInput(input, e);
      document.addEventListener("keydown", input.keyDownListener);
    }
  }
  function setUpStoredInput(input, getItem, setItem) {
    if (!input.id) {
      console.log(`Input without id cannot store its value: `);
      console.log(input);
      return;
    }
    if (getItem(input.id) != null) {
      input.querySelector(".input__manual-inner").innerText = getItem(input.id);
    }
    input.storeValue = function () {
      setItem(input.id, input.getValue());
    }
  }
  function getItemFromCookie(key) {
    return document.cookie.split(";").map(entry => entry.split("=")).find(entry => entry[0].trim() == key)?.[1] ?? null;
  }
  function setItemToCookie(key, value) {
    document.cookie = `${key}=${value}`;
  }

  // 14
  document.querySelectorAll(".scroll__top").forEach(btn =>
    btn.addEventListener("click", () => {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }));

  let lastKnownScrollPosition = 0;
  let ticking = false;
  document.addEventListener("scroll", e => {
    lastKnownScrollPosition = window.scrollY;
    if (!ticking) {
      setTimeout(() => {
        if (lastKnownScrollPosition >= window.innerHeight) {
          document.querySelectorAll(".show__on__scroll").forEach(el => el.classList.add("show"));
        } else {
          document.querySelectorAll(".show__on__scroll").forEach(el => el.classList.remove("show"));
        }
        ticking = false;
      }, 20);
      ticking = true;
    }
  });

  // 15
  document.querySelectorAll(".outer__click").forEach(
    outer => outer.addEventListener("click", () => alert("Outer clicked"))
  );
  document.querySelectorAll(".inner__click").forEach(inner =>
    inner.addEventListener("click", e => {
      e.stopPropagation();
      alert("Inner clicked");
    })
  );

  // 16
  document.querySelectorAll(".click__open__shadow").forEach(btn =>
    btn.addEventListener("click", e => {
      e.stopPropagation();
      let oldWidth = document.documentElement.clientWidth;
      document.body.classList.add("show-shadow");
      let newWidth = document.documentElement.clientWidth;
      let scrollbarWidth = Math.max(0, newWidth - oldWidth);
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }));
  document.body.addEventListener("click", () => {
    if (document.body.classList.contains("show-shadow")) {
      document.body.classList.remove("show-shadow");
      document.body.style.paddingRight = "";
    }
  });

  // 17
  document.querySelectorAll(".prevent__reload").forEach(
    form => form.addEventListener("submit", e => e.preventDefault())
  );

  // 18
  globalThis.addEventListener("dragover", e => e.preventDefault());
  document.querySelectorAll(".drag__n__drop-container").forEach(dragAndDropZone => {
    dragAndDropZone.addEventListener("dragover", e => {
      if (!dragAndDropZone.classList.contains("dragover") &&
        [...e.dataTransfer.items].some(item => item.kind === "file")) {
        e.preventDefault();
        dragAndDropZone.classList.add("dragover");
      }
    });
    dragAndDropZone.addEventListener("dragleave", () => {
      if (dragAndDropZone.classList.contains("dragover")) {
        dragAndDropZone.classList.remove("dragover");
      }
    });
    dragAndDropZone.addEventListener("drop", e => {
      e.preventDefault();
      dragAndDropZone.classList.remove("dragover");
      const files = [...e.dataTransfer.items].filter(item => item.kind === "file" && item.type !== "")
        .map(file => file.getAsFile());
      renderFiles(files, dragAndDropZone.querySelector(".drag__n__drop-list"));
    });
    const input = dragAndDropZone.querySelector(".drag__n__drop-input");
    input.addEventListener("change", e => {
      renderFiles([...e.target.files], dragAndDropZone.querySelector(".drag__n__drop-list"));
      e.target.value = "";
    });
  });
  function renderFiles(files, container) {
    if (!container || files.length == 0) {
      return;
    }
    for (const file of files) {
      const tag = document.createElement("li");
      tag.classList.add("drag__n__drop-file");
      tag.innerText = file.name;
      container.appendChild(tag);
      tag.addEventListener("click", () => tag.remove());
    }
  }
})();