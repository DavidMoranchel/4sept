// Initialize Firebase
var config = {
	apiKey: "AIzaSyBuBB05w_fIofqhQSTMMw8lq_LT8F9MOa0",
	authDomain: "pinkoderday.firebaseapp.com",
	databaseURL: "https://pinkoderday.firebaseio.com",
	projectId: "pinkoderday",
	storageBucket: "pinkoderday.appspot.com",
	messagingSenderId: "931086143860"
};
firebase.initializeApp(config);

// database
const db = firebase.database();
const productsDbRef = db.ref('products');
// storage
const st = firebase.storage();
const productsStRef = st.ref('products');

productsDbRef.on('child_added', (snapshot) => {
	let product = snapshot.val();
	$("#product-wrapper").append(`
		<div class="col-md-6 col-lg-3">
			<div class="card">
				<img class="card-img-top" src="${product.productImageUrl}" alt="Card image cap">
				<div class="card-body">
					<h5 class="card-title">${product.productName}</h5>
					<p class="card-text">${product.productDescription}</p>
					<p class="card-text">$${product.productPrice}.00</p>
					<a href="#" class="btn btn-primary btn-block">Agregar al carrito</a>
				</div>
			</div>
		</div>
	`);
});

const getFormData = () => {
	let productImg = $("#product-image").prop("files")[0];
	let uploadTask = productsStRef.child(productImg.name).put(productImg);
	uploadTask.on('state_changed',(snapshot) => {
			let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; /*calculo del porcentaje de subida ("bytesTransferred" y "totalBytes" son variables por defecto de firebase)*/
			console.log(`upload is ${progress}% done`);
	}, (error) => {
			console.log(error)
	}, () => {
			uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => { /*una vez que el archivo se ha subido, extraemos la url donde se almacenó*/
					let productObj = {  /*creamos el objeto que vamos a subir a nuestra base de datos*/
							productName:        $("#product-name").val(),
							productDescription: $("#product-description").val(),
							productPrice:       $("#product-price").val(),
							productImageUrl:    downloadURL
					}
					console.log(productObj);
					productsDbRef.push(productObj).then(() => {
						cleanForm();
					}); /*agregamos el objeto a nuestro catálogo en la base de datos*/
			})
	})
}

const showFileName = (fileInput) => {
	let filename = $(fileInput).val();
	$(fileInput).siblings("label").text(filename)
}

const cleanForm = () => {
	$("#product-name").val('');
	$("#product-description").val('');
	$("#product-price").val('');
	$("#product-image").val('');
	$("#product-image").siblings('label').html('');
}
