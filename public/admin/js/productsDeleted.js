//Restore Item
const buttonRestore = document.querySelectorAll("[button-restore]")
console.log(buttonRestore)

if(buttonRestore.length > 0) {
    const formRestoreItem = document.querySelector("#form-restore-item")
    const path = formRestoreItem.getAttribute("data-path")
    buttonRestore.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn khôi phục sản phẩm này?")
            
            if(isConfirm) {
                const id = button.getAttribute("data-id");
                const action = path + `/${id}?_method=PATCH`
                formRestoreItem.action = action
                formRestoreItem.submit()
                
            }
        })
    })
}
//End Restore Item

//Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]")
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']")

    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true
            })
        } else {
            inputsId.forEach(input => {
                input.checked = false
            })
        }
    })

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length
            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true
            } else {
                inputCheckAll.checked = false
            }

        })
    })
}
//End Checkbox Multi

//Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]")
if (formChangeMulti) {
    //form khi submit luôn load lại nên phải ngăn chặn lại
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const inputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked")

        const typeChange = e.target.elements.type.value

        if (typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này không?");

            if (!isConfirm) {
                return;
            }

        }

        if (inputChecked.length > 0) {
            let ids = []
            const inputIds = formChangeMulti.querySelector("input[name='ids']")

            inputChecked.forEach(input => {
                const id = input.value;
                ids.push(id)
            })

            inputIds.value = ids.join(", ")
            formChangeMulti.submit()
        } else {
            alert("vui lòng chọn ít nhất mọt bản ghi")
        }


    })
}
//End Form Change Multi