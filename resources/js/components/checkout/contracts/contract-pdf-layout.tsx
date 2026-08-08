import {
    Document,
    Font,
    Page,
    StyleSheet,
    Text,
    View,
} from '@react-pdf/renderer';

Font.registerHyphenationCallback((word) => [word]);

export interface ContractClause {
    heading: string;
    paragraphs: string[];
}

interface ContractPdfLayoutProps {
    introduction: string;
    clauses: ContractClause[];
    subject: string;
}

const styles = StyleSheet.create({
    page: {
        paddingTop: 74,
        paddingRight: 52,
        paddingBottom: 60,
        paddingLeft: 52,
        fontFamily: 'Helvetica',
        fontSize: 9.5,
        lineHeight: 1.5,
        color: '#111827',
    },
    header: {
        position: 'absolute',
        top: 26,
        right: 52,
        left: 52,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.6,
        borderBottomColor: '#dbe6d5',
        paddingBottom: 8,
    },
    brand: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 11,
        letterSpacing: 1.2,
        color: '#6aae3b',
    },
    website: {
        fontSize: 8,
        color: '#6aae3b',
    },
    title: {
        marginBottom: 18,
        fontFamily: 'Helvetica-Bold',
        fontSize: 15,
        textAlign: 'center',
        textDecoration: 'underline',
    },
    paragraph: {
        marginBottom: 10,
        textAlign: 'justify',
        orphans: 3,
        widows: 3,
    },
    clause: {
        marginBottom: 2,
    },
    clauseHeading: {
        fontFamily: 'Helvetica-Bold',
    },
    bankDetails: {
        marginBottom: 8,
        marginLeft: 14,
        fontFamily: 'Helvetica-Bold',
        lineHeight: 1.65,
    },
    footer: {
        position: 'absolute',
        right: 52,
        bottom: 24,
        left: 52,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 0.6,
        borderTopColor: '#dbe6d5',
        paddingTop: 7,
        fontSize: 7.5,
        color: '#667085',
    },
});

export function ContractPdfLayout({
    introduction,
    clauses,
    subject,
}: ContractPdfLayoutProps) {
    return (
        <Document
            title="Contrato de sub-arrendamiento"
            author="Animal Coworking Group SpA"
            subject={subject}
            creator="Animal Co-work"
        >
            <Page size="A4" style={styles.page} wrap>
                <View style={styles.header} fixed>
                    <Text style={styles.brand}>ANIMAL CO-WORK</Text>
                    <Text style={styles.website}>www.animalcoworking.cl</Text>
                </View>

                <Text style={styles.title}>CONTRATO DE SUB-ARRENDAMIENTO</Text>

                <Text style={styles.paragraph}>{introduction}</Text>

                {clauses.map((clause) => (
                    <View key={clause.heading} style={styles.clause}>
                        {clause.paragraphs.map((paragraph, index) => (
                            <Text
                                key={`${clause.heading}-${index}`}
                                style={
                                    paragraph.startsWith('CUENTA CORRIENTE')
                                        ? styles.bankDetails
                                        : styles.paragraph
                                }
                                minPresenceAhead={index === 0 ? 30 : 0}
                            >
                                {index === 0 && (
                                    <Text style={styles.clauseHeading}>
                                        {clause.heading}{' '}
                                    </Text>
                                )}
                                {paragraph}
                            </Text>
                        ))}
                    </View>
                ))}

                <View style={styles.footer} fixed>
                    <Text>Animal Coworking Group SpA</Text>
                    <Text
                        render={({ pageNumber, totalPages }) =>
                            `Página ${pageNumber} de ${totalPages}`
                        }
                    />
                </View>
            </Page>
        </Document>
    );
}
