import React from 'react';
import { PDFDownloadLink, Document, Page, Text, Image, View, StyleSheet } from '@react-pdf/renderer';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 20 },
  header: { fontSize: 20, marginBottom: 10 },
  text: { fontSize: 14, marginBottom: 5 },
  logo: { width: 100, height: 100, marginBottom: 20 },
});

// Create the InvoiceDocument component
const InvoiceDocument = ({ formData }) => {
  const { customerName, items, address, totalPrice } = formData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo Section */}
        <View style={styles.section}>
          <Image src="/logo.png" style={styles.logo} />
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.header}>Invoice</Text>
          <Text style={styles.text}>Customer Name: {customerName}</Text>
          {address && <Text style={styles.text}>Address: {address}</Text>}
        </View>

        {/* Items List */}
        <View style={styles.section}>
          <Text style={styles.header}>Items</Text>
          {items.map((item, index) => (
            <Text key={index} style={styles.text}>
              {item.name} - ${item.price}
            </Text>
          ))}
        </View>

        {/* Total Price */}
        <Text style={styles.text}>Total Price: ${totalPrice}</Text>
      </Page>
    </Document>
  );
};

// Main InvoicePDF Component
export default function InvoicePDF({ formData }) {
  return (
    <PDFDownloadLink
      document={<InvoiceDocument formData={formData} />}
      fileName="invoice.pdf"
    >
      {({ loading }) =>
        loading ? 'Generating PDF...' : 'Download Invoice'
      }
    </PDFDownloadLink>
  );
}
