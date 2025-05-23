// Facture.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../assets/logo-fr.png';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  logo: { width: 100 },
  section: { marginBottom: 10 },
  bold: { fontWeight: 'bold' },
  tableHeader: { flexDirection: 'row', borderBottom: '1 solid #000', marginBottom: 4 },
  row: { flexDirection: 'row', borderBottom: '1 solid #ccc', paddingVertical: 2 },
  col: { width: '25%' },
});

const Facture = ({ data }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src={logo} />
        <View>
          <Text>Société ABC SARL</Text>
          <Text>Rue 123, Casablanca</Text>
          <Text>Tél: +212 6 12 34 56 78</Text>
          <Text>Email: contact@abc.ma</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Facture N°: {data.id}</Text>
        <Text>Date: {new Date(data.created_at).toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Client:</Text>
        <Text>{data.client.prenom} {data.client.nom}</Text>
        <Text>{data.client.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Produits:</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.col}>Produit</Text>
          <Text style={styles.col}>PU</Text>
          <Text style={styles.col}>Qté</Text>
          <Text style={styles.col}>Total</Text>
        </View>
        {data.produits.map((p, i) => (
          <View style={styles.row} key={i}>
            <Text style={styles.col}>{p.nom}</Text>
            <Text style={styles.col}>{p.prix_unitaire} MAD</Text>
            <Text style={styles.col}>{p.quantite}</Text>
            <Text style={styles.col}>{p.prix_unitaire * p.quantite} MAD</Text>
          </View>
        ))}
      </View>

      {data.code_promo && (
        <View style={styles.section}>
          <Text style={styles.bold}>Code Promo:</Text>
          <Text>{data.code_promo.code} (Réduction: {data.code_promo.montant} MAD)</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.bold}>Montant Total: {data.prix_total} MAD</Text>
      </View>
    </Page>
  </Document>
);

export default Facture;
