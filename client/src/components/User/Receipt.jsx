import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
      page: {
            flexDirection: "column",
            backgroundColor: "#FFFFFF",
            padding: 30,
      },
      header: {
            marginBottom: 20,
            borderBottom: 1,
            paddingBottom: 10,
      },
      title: {
            fontSize: 24,
            textAlign: "center",
            marginBottom: 10,
      },
      subtitle: {
            fontSize: 12,
            textAlign: "center",
            color: "#666",
      },
      section: {
            margin: 10,
            padding: 10,
      },
      row: {
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#EEEEEE",
            paddingVertical: 5,
      },
      column: {
            flexDirection: "column",
            marginBottom: 10,
      },
      text: {
            fontSize: 10,
      },
      bold: {
            fontWeight: "bold",
      },
      total: {
            marginTop: 20,
            borderTopWidth: 1,
            borderTopColor: "#000000",
            paddingTop: 10,
      },
      footer: {
            position: "absolute",
            bottom: 30,
            left: 30,
            right: 30,
            textAlign: "center",
            fontSize: 8,
            color: "#666",
      },
});

const Receipt = ({ orderData }) => {
      const {
            razorpay_payment_id,
            razorpay_order_id,
            items,
            total,
            subtotal,
            tax,
            bag,
            date,
            customerName,
            billingAddress,
      } = orderData;

      return (
            <Document>
                  <Page size="A4" style={styles.page}>
                        <View style={styles.header}>
                              <Text style={styles.title}>Quick Pick</Text>
                              <Text style={styles.subtitle}>
                                    Payment Receipt
                              </Text>
                        </View>

                        <View style={styles.section}>
                              <View style={styles.column}>
                                    <Text style={styles.text}>
                                          Payment ID: {razorpay_payment_id}
                                    </Text>
                                    <Text style={styles.text}>
                                          Order ID: {razorpay_order_id}
                                    </Text>
                                    <Text style={styles.text}>
                                          Date: {date}
                                    </Text>
                              </View>
                        </View>

                        <View style={styles.section}>
                              <Text style={[styles.text, styles.bold]}>
                                    Customer Details
                              </Text>
                              <View style={styles.column}>
                                    <Text style={styles.text}>
                                          Name: {customerName}
                                    </Text>
                                    <Text style={styles.text}>
                                          Address: {billingAddress}
                                    </Text>
                              </View>
                        </View>

                        <View style={styles.section}>
                              <Text style={[styles.text, styles.bold]}>
                                    Order Details
                              </Text>
                              {items.map((item, index) => (
                                    <View key={index} style={styles.row}>
                                          <Text style={styles.text}>
                                                {item.productName}
                                          </Text>
                                          <Text style={styles.text}>
                                                ₹{item.price.toFixed(2)}
                                          </Text>
                                    </View>
                              ))}
                        </View>

                        <View style={[styles.section, styles.total]}>
                              <View style={styles.row}>
                                    <Text style={styles.text}>Subtotal</Text>
                                    <Text style={styles.text}>
                                          ₹{subtotal.toFixed(2)}
                                    </Text>
                              </View>
                              <View style={styles.row}>
                                    <Text style={styles.text}>Tax</Text>
                                    <Text style={styles.text}>
                                          ₹{tax.toFixed(2)}
                                    </Text>
                              </View>
                              <View style={styles.row}>
                                    <Text style={styles.text}>Bag</Text>
                                    <Text style={styles.text}>
                                          ₹{bag.toFixed(2)}
                                    </Text>
                              </View>
                              <View style={[styles.row, styles.bold]}>
                                    <Text style={styles.text}>Total</Text>
                                    <Text style={styles.text}>₹{total}</Text>
                              </View>
                        </View>

                        <View style={styles.footer}>
                              <Text>
                                    Thank you for shopping with Quick Pick!
                              </Text>
                              <Text>
                                    This is a computer-generated receipt. No
                                    signature required.
                              </Text>
                        </View>
                  </Page>
            </Document>
      );
};

export default Receipt;
