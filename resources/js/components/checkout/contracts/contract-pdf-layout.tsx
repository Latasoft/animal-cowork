import {
    Document,
    Font,
    Image,
    Page,
    StyleSheet,
    Text,
    View,
} from '@react-pdf/renderer';

import type { SourceObject } from '@react-pdf/types';
Font.registerHyphenationCallback((word) => [word]);

export interface ContractClause {
    heading: string;
    paragraphs: string[];
}

export interface ContractContent {
    introduction: string;
    clauses: ContractClause[];
    subject: string;
}

export type ContractLogoSource = SourceObject;

interface ContractPdfLayoutProps extends ContractContent {
    logoSource: ContractLogoSource;
}

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 9.5,
        lineHeight: 1.5,
        color: '#111827',
    },
    pageSection: {
        height: 841,
        paddingTop: 18,
        paddingRight: 52,
        paddingBottom: 24,
        paddingLeft: 52,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.6,
        borderBottomColor: '#dbe6d5',
        marginBottom: 24,
        paddingBottom: 8,
    },
    logo: {
        width: 112,
        height: 47,
        objectFit: 'contain',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 0.6,
        borderTopColor: '#dbe6d5',
        marginTop: 'auto',
        paddingTop: 7,
        fontSize: 7.5,
        color: '#667085',
    },
    authenticity: {
        flexGrow: 1,
        paddingRight: 16,
    },
    authenticityLink: {
        color: '#6aae3b',
        textDecoration: 'underline',
    },
    pageNumber: {
        width: 80,
        textAlign: 'right',
    },
});

export function ContractPdfLayout({
    introduction,
    clauses,
    subject,
    logoSource,
}: ContractPdfLayoutProps) {
    return (
        <Document
            title="Contrato de sub-arrendamiento"
            author="Animal Coworking Group SpA"
            subject={subject}
            creator="Animal Co-work"
        >
            <Page size="A4" style={styles.page} wrap>
                <ContractPageSection
                    pageNumber={1}
                    totalPages={4}
                    introduction={introduction}
                    clauses={clauses.slice(0, 3)}
                    logoSource={logoSource}
                />
                <ContractPageSection
                    pageNumber={2}
                    totalPages={4}
                    clauses={clauses.slice(3, 5)}
                    logoSource={logoSource}
                />
                <ContractPageSection
                    pageNumber={3}
                    totalPages={4}
                    clauses={clauses.slice(5, 7)}
                    logoSource={logoSource}
                />
                <ContractPageSection
                    pageNumber={4}
                    totalPages={4}
                    clauses={clauses.slice(7)}
                    logoSource={logoSource}
                />
            </Page>
        </Document>
    );
}

interface ContractPageSectionProps {
    pageNumber: number;
    totalPages: number;
    introduction?: string;
    clauses: ContractClause[];
    logoSource: ContractLogoSource;
}

function ContractPageSection({
    pageNumber,
    totalPages,
    introduction,
    clauses,
    logoSource,
}: ContractPageSectionProps) {
    return (
        <View
            style={[
                styles.pageSection,
                pageNumber % 2 === 1
                    ? { height: 783, paddingTop: 76 }
                    : { paddingTop: 18 },
            ]}
            break={pageNumber > 1}
            wrap={false}
        >
            <View style={styles.header}>
                <Image src={logoSource} style={styles.logo} cache={false} />
                <Text style={styles.website}>www.animalcoworking.cl</Text>
            </View>

            {introduction && (
                <>
                    <Text style={styles.title}>
                        CONTRATO DE SUB-ARRENDAMIENTO
                    </Text>
                    <Text style={styles.paragraph}>{introduction}</Text>
                </>
            )}

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

            <View style={styles.footer}>
                <Text style={styles.authenticity}>
                    Verifica la autenticidad de este documento{' '}
                    <Text style={styles.authenticityLink}>aquí</Text>
                </Text>
                <Text style={styles.pageNumber}>
                    Página {pageNumber} de {totalPages}
                </Text>
            </View>
        </View>
    );
}
