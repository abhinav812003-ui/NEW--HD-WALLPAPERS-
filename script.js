// Free wallpapers download
document.querySelectorAll('.free-wallpaper').forEach(img => {
    img.addEventListener('click', () => {
        const imageSrc = img.getAttribute('src');
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = imageSrc.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert('Wallpaper downloaded!');
    });
});

// Premium wallpapers payment via Razorpay
document.querySelectorAll('.premium-wallpaper').forEach(img => {
    img.addEventListener('click', () => {
        const options = {
            "key": rzp_test_S3moPHj3QE7syA
            "amount": 1000, // Amount in paisa (₹10)
            "currency": "INR",
            "name": "Wallpaper Hub",
            "description": "Premium Wallpaper Purchase",
            "handler": function (response){
                alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
                // Payment success → download wallpaper
                const link = document.createElement('a');
                link.href = img.getAttribute('src');
                link.download = img.getAttribute('src').split('/').pop();
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
    });
});