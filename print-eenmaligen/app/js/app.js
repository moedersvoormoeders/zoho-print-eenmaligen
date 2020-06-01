var eenmaligenNummer = "";
var naam = "";

function initializeWidget() {
	/*
	 * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget 
	 */
	ZOHO.embeddedApp.on("PageLoad",function(data) {
		$('#nodata-alert').alert('close')
		if(!data || !data.Entity) {
			$('#nodata-alert').alert()
			return
		}
		ZOHO.CRM.API.getRecord({Entity:data.Entity,RecordID:data.EntityId})
		.then(function(response) {
			console.log(response)
			eenmaligenNummer = response.data[0].EenmaligNummer
			naam = `${response.data[0].Eenmaligvoornaam} ${response.data[0].Name}`;
		});
	})
	/*
	 * initialize the widget.
	 */
	ZOHO.embeddedApp.init();
}

function sendPrint() {
	if ($("#bericht").val().trim() == "") {
		alert("Gelieve een bericht te typen voor te verzenden")
		return
	}
	sendPrintKleding().then((resp)=> {
		alert("Print verzonden!")
		$("#bericht").val("")
	}, ()=> alert("Fout opgetreden, print niet verzonden"))
}

async function sendPrintKleding() {
	// TODO: change printer FQDN
	const response = await fetch("https://print.kleding.mvm.maartje.dev/eenmaligen", {
	  method: 'POST',
	  mode: 'cors',
	  cache: 'no-cache',
	  credentials: 'same-origin',
	  headers: {
		'Content-Type': 'application/json'
		 },
	  redirect: 'follow',
	  referrerPolicy: 'no-referrer',
	  body: JSON.stringify({
		"eenmaligenNummer": eenmaligenNummer,
		"naam": naam,
		"bericht": $("#bericht").val(),
	  })
	});
	return await response.json();
  }
