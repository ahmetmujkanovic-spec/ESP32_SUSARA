function updateFirmware()
{

    const url =
    document.getElementById(
        "firmwareUrl"
    ).value.trim();


    if(!url)
    {
        alert("Unesi firmware link");
        return;
    }


    if(!confirm("Pokrenuti OTA update?"))
    {
        sendFirmwareUpdate(url);
        return;
    }


    sendFirmwareUpdate(url);

}
