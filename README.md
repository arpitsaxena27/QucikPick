#  QuickPick  
*A seamless in-store shopping experience powered by Wi-Fi RTT navigation, RFID-enabled checkout, and intelligent digital cart integration.*  

---

##  Overview  
**QuickPick** redefines physical retail by eliminating inefficiencies like confusing store layouts and long checkout lines.  
Using **Wi-Fi RTT precision navigation**, **RFID-secured checkout**, and a **digital cart app** (hosted as an Android WebView on **Vercel**), QuickPick ensures a **frictionless shopping journey**.  

---

##  Customer Journey  
1. **Plan Ahead** → Shoppers curate their cart in advance.  
2. **Navigate Smarter** → Wi-Fi RTT provides **sub-meter accuracy**; a **dynamic map** guides shoppers via a **custom BFS pathfinding algorithm** on a JSON-based store layout.  
3. **Find Faster** → OpenCV-based shelf detection ensures accurate routing to shelves.  
4. **Checkout Instantly** → Items confirmed in the digital cart are paid online.  
5. **Exit Smoothly** → RFID tags secure exits; unpaid items trigger alerts.  

---

##  Retailer Dashboard  
- Configure **shelf layouts** visually.  
- Manage **inventory in real-time**.  
- Monitor **cart activity** and **store flow**.  
- Gain insights for **layout optimization** and **stock planning**.  

---

<figure>
  <img width="1919" height="946" alt="Screenshot 2025-10-07 182126" src="https://github.com/user-attachments/assets/b6a3cbc7-56e1-48ef-aafd-d4f231d24f4b" /><br>
  <figcaption><b> Welcome to QuickPick </b></figcaption>
</figure>

<figure>
  <img width="1919" height="946" alt="Screenshot 2025-10-07 182136" src="https://github.com/user-attachments/assets/a7fd47be-8a67-4ba2-9030-1a672887dc7c" /><br>
  <figcaption><b> Login as Retailer or Customer </b></figcaption>
</figure>

<figure>
  <img width="1919" height="948" alt="Screenshot 2025-10-07 182015" src="https://github.com/user-attachments/assets/4aa6db20-3b9c-4556-82ce-cf8d0eab5517" /><br>
  <figcaption><b> Retailer Floor Map </b></figcaption>
</figure>

<figure>
  <img width="1919" height="950" alt="Screenshot 2025-10-07 182029" src="https://github.com/user-attachments/assets/6a35d4db-3100-46f2-ac4d-7a942f2441fe" /><br>
  <figcaption><b> Automatic Shelf Detection </b></figcaption>
</figure>

<figure>
  <img width="1919" height="948" alt="Screenshot 2025-10-07 182236" src="https://github.com/user-attachments/assets/b0142e71-5924-4be2-b704-7fba663c2e0b" /><br>
  <figcaption><b> Retailer Inventory Management </b></figcaption>
</figure>

<figure>
  <img width="1919" height="952" alt="Screenshot 2025-10-07 182248" src="https://github.com/user-attachments/assets/9735fa42-70cd-4209-9353-8f1beb3e9ad3" /><br>
  <figcaption><b> Retailer Inventory Management </b></figcaption>
</figure>

<figure>
  <img width="4243" height="2828" alt="Picsart_25-10-07_18-32-15-384" src="https://github.com/user-attachments/assets/0a4f803e-9e8d-4d71-bff8-a0342f27c9ec" /><br>
  <figcaption><b> Customer Mobile View </b></figcaption>
</figure>

<figure>
  <img width="3464" height="3464" alt="Picsart_25-10-07_18-33-10-509" src="https://github.com/user-attachments/assets/26071229-84c8-4cb9-a018-25d614b0964e" /><br>
  <figcaption><b> Seemless Checkout Process </b></figcaption>
</figure>

---

##  Tech Stack  

- **Frontend:** React + Android WebView (hosted on [Vercel]([https://vercel.com/](https://quickpick1.vercel.app/)))  
- **Backend:** Node.js + Express  
- **Database:** MongoDB (NoSQL)  
- **State Management:** Redux Toolkit  
- **Indoor Positioning:** Wi-Fi RTT (Android/Web)  
- **Navigation Engine:** Custom BFS/Dijkstra pathfinding over JSON store layouts  
- **Computer Vision:** OpenCV (shelf detection on store maps)  
- **Security:** RFID tags + Role-Based Access Control (RBAC)  

---

##  Features  
-  **Indoor navigation** with sub-meter accuracy  
-  **Digital cart integration**  
-  **Frictionless checkout** (RFID-based)  
-  **Retailer dashboard** with real-time analytics  
-  **RBAC-secured management**  

---
