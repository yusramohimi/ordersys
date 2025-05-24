// InvoiceModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import Facture from './Facture';

const InvoiceModal = ({ commandeId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (commandeId) {
      axios.get(`http://localhost:8000/api/facture/${commandeId}`)
        .then(res => {
          setData(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [commandeId]);

  if (!commandeId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[90vw] h-[90vh] p-4 relative rounded shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-red-600 font-bold text-lg">×</button>
        <h2 className="text-xl font-semibold mb-4">Facture Commande #{commandeId}</h2>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <>
            <div className="h-[80%] border rounded">
              <PDFViewer width="100%" height="100%">
                <Facture data={data} />
              </PDFViewer>
            </div>
            <div className="mt-4 text-right">
              <PDFDownloadLink
                document={<Facture data={data} />}
                fileName={`facture-${commandeId}.pdf`}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {({ loading }) => (loading ? 'Préparation...' : 'Télécharger la facture')}
              </PDFDownloadLink>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceModal;
