const fs = require('fs');
let content = fs.readFileSync('components/RazorpayCheckoutButton.tsx', 'utf8');

content = content.replace(`      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount * 100, // convert to paise
          currency: "INR",
          receipt: \`rcpt_\${Date.now()}\`,
        }),
      });
      const order = await res.json();
      if (!order || !order.order_id) {
        throw new Error("Order creation failed");
      }`, `      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount * 100, // convert to paise
          currency: "INR",
          receipt: \`rcpt_\${Date.now()}\`,
        }),
      });
      
      const order = await res.json();
      if (!res.ok) {
        throw new Error(order.error || "Order creation failed");
      }
      
      if (!order || !order.order_id) {
        throw new Error("Order creation failed: missing order_id");
      }`);

content = content.replace(`    } catch (error) {
      console.error(error);
      alert("Something went wrong during payment initialization.");
    }`, `    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong during payment initialization.");
    }`);

fs.writeFileSync('components/RazorpayCheckoutButton.tsx', content);
console.log("Patched RazorpayCheckoutButton.tsx");
