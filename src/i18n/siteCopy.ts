import { type SupportedLanguage } from "@/i18n/translations";

type SiteLanguageCopy = {
  common: {
    backHome: string;
  };
  notFound: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    body: string;
    cta: string;
  };
  download: {
    metaTitle: string;
    loadingTitle: string;
    loadingBody: string;
    readyTitle: string;
    readyBody: string;
    fallbackBody: string;
    emailTitle: string;
    emailBody: string;
    deliveryPolicyNote: string;
    orderReferenceLabel: string;
    downloadsUsed: string;
    blockedTitle: string;
    blockedSupportBody: string;
    manualResendTitle: string;
    manualResendSupportBody: string;
    errorTitle: string;
    errorBody: string;
    errorSupportBody: string;
  };
  legal: {
    englishNoticeTitle: string;
    englishNoticeBody: string;
    lastUpdatedLabel: string;
  };
  privacy: {
    metaTitle: string;
    metaDescription: string;
    title: string;
  };
  terms: {
    metaTitle: string;
    metaDescription: string;
    title: string;
  };
};

export const siteCopy: Record<SupportedLanguage, SiteLanguageCopy> = {
  en: {
    common: { backHome: "Back to home" },
    notFound: {
      metaTitle: "Page not found",
      metaDescription: "The page you requested could not be found.",
      title: "Page not found",
      body: "The link may be broken or the page may have moved.",
      cta: "Go to home",
    },
    download: {
      metaTitle: "Download your file",
      loadingTitle: "Preparing your download",
      loadingBody: "This usually takes a few seconds.",
      readyTitle: "Your download is ready",
      readyBody: "Thanks for your order. Your secure file links should start downloading automatically.",
      fallbackBody: "If the download does not start automatically, use the secure buttons below.",
      emailTitle: "Check your email",
      emailBody: "We also sent secure download links to your email.",
      deliveryPolicyNote: "Links stay active for {hours} hours and allow up to {maxDownloads} downloads.",
      orderReferenceLabel: "Order reference",
      downloadsUsed: "{used} of {total} downloads used",
      blockedTitle: "Some files need manual resend support.",
      blockedSupportBody: "If you still need a file after the limit is reached, contact support.",
      manualResendTitle: "Manual resend required",
      manualResendSupportBody: "Contact support and we will help with a manual resend.",
      errorTitle: "We couldn't prepare your download yet",
      errorBody: "If your payment went through, don't worry. We can resend fresh secure download links to your email.",
      errorSupportBody: "If the issue continues, contact support.",
    },
    legal: {
      englishNoticeTitle: "English version",
      englishNoticeBody: "This document is provided in English. Translations are for convenience only.",
      lastUpdatedLabel: "Last updated",
    },
    privacy: {
      metaTitle: "Privacy Policy",
      metaDescription: "How we collect, use, and protect your information.",
      title: "Privacy Policy",
    },
    terms: {
      metaTitle: "Terms of Service",
      metaDescription: "The terms that apply to your use of this site and its services.",
      title: "Terms of Service",
    },
  },
  es: {
    common: { backHome: "Volver al inicio" },
    notFound: {
      metaTitle: "Página no encontrada",
      metaDescription: "No encontramos la página que solicitaste.",
      title: "Página no encontrada",
      body: "El enlace puede estar roto o la página se movió.",
      cta: "Ir al inicio",
    },
    download: {
      metaTitle: "Descarga tu archivo",
      loadingTitle: "Preparando tu descarga",
      loadingBody: "Esto suele tardar unos segundos.",
      readyTitle: "Tu descarga está lista",
      readyBody: "Gracias por tu pedido. Tus enlaces seguros deberían empezar a descargarse automáticamente.",
      fallbackBody: "Si la descarga no empieza automáticamente, usa los botones seguros de abajo.",
      emailTitle: "Revisa tu correo",
      emailBody: "También enviamos los enlaces seguros de descarga a tu correo.",
      deliveryPolicyNote: "Los enlaces están activos durante {hours} horas y permiten hasta {maxDownloads} descargas.",
      orderReferenceLabel: "Referencia del pedido",
      downloadsUsed: "{used} de {total} descargas usadas",
      blockedTitle: "Algunos archivos requieren reenvío manual.",
      blockedSupportBody: "Si aún necesitas un archivo tras alcanzar el límite, contacta con soporte.",
      manualResendTitle: "Se requiere reenvío manual",
      manualResendSupportBody: "Contacta con soporte y te ayudaremos con un reenvío manual.",
      errorTitle: "Todavía no pudimos preparar tu descarga",
      errorBody: "Si tu pago se procesó, no te preocupes. Podemos reenviar enlaces seguros nuevos a tu correo.",
      errorSupportBody: "Si el problema continúa, contacta con soporte.",
    },
    legal: {
      englishNoticeTitle: "Versión en inglés",
      englishNoticeBody: "Este documento se ofrece en inglés. Las traducciones son solo de cortesía.",
      lastUpdatedLabel: "Última actualización",
    },
    privacy: {
      metaTitle: "Política de privacidad",
      metaDescription: "Cómo recopilamos, usamos y protegemos tu información.",
      title: "Política de privacidad",
    },
    terms: {
      metaTitle: "Términos del servicio",
      metaDescription: "Los términos aplicables al uso de este sitio y sus servicios.",
      title: "Términos del servicio",
    },
  },
  fr: {
    common: { backHome: "Retour à l'accueil" },
    notFound: {
      metaTitle: "Page introuvable",
      metaDescription: "La page demandée est introuvable.",
      title: "Page introuvable",
      body: "Le lien est peut-être invalide ou la page a été déplacée.",
      cta: "Retour à l'accueil",
    },
    download: {
      metaTitle: "Télécharger votre fichier",
      loadingTitle: "Préparation du téléchargement",
      loadingBody: "Cela prend généralement quelques secondes.",
      readyTitle: "Votre téléchargement est prêt",
      readyBody: "Merci pour votre commande. Vos liens sécurisés devraient démarrer automatiquement.",
      fallbackBody: "Si le téléchargement ne démarre pas automatiquement, utilisez les boutons sécurisés ci-dessous.",
      emailTitle: "Vérifiez votre e-mail",
      emailBody: "Nous avons aussi envoyé les liens sécurisés de téléchargement à votre e-mail.",
      deliveryPolicyNote: "Les liens restent actifs pendant {hours} heures et permettent jusqu'à {maxDownloads} téléchargements.",
      orderReferenceLabel: "Référence de commande",
      downloadsUsed: "{used} téléchargements sur {total} utilisés",
      blockedTitle: "Certains fichiers nécessitent un renvoi manuel.",
      blockedSupportBody: "Si vous avez encore besoin d'un fichier après la limite, contactez le support.",
      manualResendTitle: "Renvoi manuel requis",
      manualResendSupportBody: "Contactez le support et nous vous aiderons avec un renvoi manuel.",
      errorTitle: "Nous ne pouvons pas encore préparer votre téléchargement",
      errorBody: "Si votre paiement est passé, ne vous inquiétez pas. Nous pouvons renvoyer de nouveaux liens sécurisés par e-mail.",
      errorSupportBody: "Si le problème persiste, contactez le support.",
    },
    legal: {
      englishNoticeTitle: "Version anglaise",
      englishNoticeBody: "Ce document est fourni en anglais. Les traductions sont proposées à titre indicatif.",
      lastUpdatedLabel: "Mis à jour le",
    },
    privacy: {
      metaTitle: "Politique de confidentialité",
      metaDescription: "Comment nous collectons, utilisons et protégeons vos informations.",
      title: "Politique de confidentialité",
    },
    terms: {
      metaTitle: "Conditions d'utilisation",
      metaDescription: "Les conditions applicables à l'utilisation de ce site et de ses services.",
      title: "Conditions d'utilisation",
    },
  },
  de: {
    common: { backHome: "Zur Startseite" },
    notFound: {
      metaTitle: "Seite nicht gefunden",
      metaDescription: "Die angeforderte Seite wurde nicht gefunden.",
      title: "Seite nicht gefunden",
      body: "Der Link ist möglicherweise defekt oder die Seite wurde verschoben.",
      cta: "Zur Startseite",
    },
    download: {
      metaTitle: "Datei herunterladen",
      loadingTitle: "Download wird vorbereitet",
      loadingBody: "Das dauert normalerweise nur ein paar Sekunden.",
      readyTitle: "Ihr Download ist bereit",
      readyBody: "Danke für Ihre Bestellung. Ihre sicheren Dateilinks sollten automatisch starten.",
      fallbackBody: "Wenn der Download nicht automatisch startet, nutzen Sie die sicheren Schaltflächen unten.",
      emailTitle: "E-Mail prüfen",
      emailBody: "Wir haben die sicheren Download-Links auch an Ihre E-Mail gesendet.",
      deliveryPolicyNote: "Links sind {hours} Stunden aktiv und erlauben bis zu {maxDownloads} Downloads.",
      orderReferenceLabel: "Bestellreferenz",
      downloadsUsed: "{used} von {total} Downloads verwendet",
      blockedTitle: "Für einige Dateien ist ein manueller Neuversand nötig.",
      blockedSupportBody: "Wenn Sie eine Datei nach dem Limit weiterhin brauchen, kontaktieren Sie den Support.",
      manualResendTitle: "Manueller Neuversand erforderlich",
      manualResendSupportBody: "Kontaktieren Sie den Support, wir helfen mit einem manuellen Neuversand.",
      errorTitle: "Ihr Download kann noch nicht vorbereitet werden",
      errorBody: "Wenn Ihre Zahlung erfolgreich war, kein Problem. Wir können frische sichere Download-Links per E-Mail erneut senden.",
      errorSupportBody: "Wenn das Problem bleibt, kontaktieren Sie den Support.",
    },
    legal: {
      englishNoticeTitle: "Englische Version",
      englishNoticeBody: "Dieses Dokument wird auf Englisch bereitgestellt. Übersetzungen dienen nur der Orientierung.",
      lastUpdatedLabel: "Zuletzt aktualisiert",
    },
    privacy: {
      metaTitle: "Datenschutzerklärung",
      metaDescription: "Wie wir Ihre Daten erfassen, verwenden und schützen.",
      title: "Datenschutzerklärung",
    },
    terms: {
      metaTitle: "Nutzungsbedingungen",
      metaDescription: "Die Bedingungen für die Nutzung dieser Website und ihrer Dienste.",
      title: "Nutzungsbedingungen",
    },
  },
  it: {
    common: { backHome: "Torna alla home" },
    notFound: {
      metaTitle: "Pagina non trovata",
      metaDescription: "La pagina richiesta non è stata trovata.",
      title: "Pagina non trovata",
      body: "Il link potrebbe non funzionare o la pagina potrebbe essere stata spostata.",
      cta: "Vai alla home",
    },
    download: {
      metaTitle: "Scarica il tuo file",
      loadingTitle: "Preparazione del download",
      loadingBody: "Di solito richiede pochi secondi.",
      readyTitle: "Il tuo download è pronto",
      readyBody: "Grazie per il tuo ordine. I link sicuri dovrebbero partire automaticamente.",
      fallbackBody: "Se il download non parte automaticamente, usa i pulsanti sicuri qui sotto.",
      emailTitle: "Controlla la tua email",
      emailBody: "Abbiamo inviato anche i link di download sicuri alla tua email.",
      deliveryPolicyNote: "I link restano attivi per {hours} ore e consentono fino a {maxDownloads} download.",
      orderReferenceLabel: "Riferimento ordine",
      downloadsUsed: "{used} download usati su {total}",
      blockedTitle: "Alcuni file richiedono un reinvio manuale.",
      blockedSupportBody: "Se ti serve ancora un file dopo il limite, contatta l'assistenza.",
      manualResendTitle: "Reinvio manuale richiesto",
      manualResendSupportBody: "Contatta l'assistenza e ti aiuteremo con un reinvio manuale.",
      errorTitle: "Non possiamo ancora preparare il download",
      errorBody: "Se il pagamento è andato a buon fine, niente paura. Possiamo reinviare nuovi link sicuri via email.",
      errorSupportBody: "Se il problema continua, contatta l'assistenza.",
    },
    legal: {
      englishNoticeTitle: "Versione inglese",
      englishNoticeBody: "Questo documento è fornito in inglese. Le traduzioni sono solo a titolo informativo.",
      lastUpdatedLabel: "Ultimo aggiornamento",
    },
    privacy: {
      metaTitle: "Informativa sulla privacy",
      metaDescription: "Come raccogliamo, usiamo e proteggiamo le tue informazioni.",
      title: "Informativa sulla privacy",
    },
    terms: {
      metaTitle: "Termini di servizio",
      metaDescription: "I termini che regolano l'uso di questo sito e dei suoi servizi.",
      title: "Termini di servizio",
    },
  },
  pt: {
    common: { backHome: "Voltar ao início" },
    notFound: {
      metaTitle: "Página não encontrada",
      metaDescription: "Não encontramos a página solicitada.",
      title: "Página não encontrada",
      body: "O link pode estar quebrado ou a página foi movida.",
      cta: "Ir para o início",
    },
    download: {
      metaTitle: "Baixe seu arquivo",
      loadingTitle: "Preparando seu download",
      loadingBody: "Isso costuma levar alguns segundos.",
      readyTitle: "Seu download está pronto",
      readyBody: "Obrigado pelo seu pedido. Seus links seguros devem começar automaticamente.",
      fallbackBody: "Se o download não começar automaticamente, use os botões seguros abaixo.",
      emailTitle: "Verifique seu e-mail",
      emailBody: "Também enviamos os links seguros de download para o seu e-mail.",
      deliveryPolicyNote: "Os links ficam ativos por {hours} horas e permitem até {maxDownloads} downloads.",
      orderReferenceLabel: "Referência do pedido",
      downloadsUsed: "{used} de {total} downloads usados",
      blockedTitle: "Alguns arquivos exigem reenvio manual.",
      blockedSupportBody: "Se você ainda precisar de um arquivo após o limite, fale com o suporte.",
      manualResendTitle: "Reenvio manual necessário",
      manualResendSupportBody: "Fale com o suporte e ajudaremos com um reenvio manual.",
      errorTitle: "Ainda não foi possível preparar seu download",
      errorBody: "Se o pagamento foi confirmado, não se preocupe. Podemos reenviar novos links seguros por e-mail.",
      errorSupportBody: "Se o problema continuar, fale com o suporte.",
    },
    legal: {
      englishNoticeTitle: "Versão em inglês",
      englishNoticeBody: "Este documento é fornecido em inglês. As traduções são apenas para conveniência.",
      lastUpdatedLabel: "Última atualização",
    },
    privacy: {
      metaTitle: "Política de Privacidade",
      metaDescription: "Como coletamos, usamos e protegemos suas informações.",
      title: "Política de Privacidade",
    },
    terms: {
      metaTitle: "Termos de Serviço",
      metaDescription: "Os termos aplicáveis ao uso deste site e dos seus serviços.",
      title: "Termos de Serviço",
    },
  },
  pl: {
    common: { backHome: "Powrót do strony głównej" },
    notFound: {
      metaTitle: "Nie znaleziono strony",
      metaDescription: "Nie znaleźliśmy żądanej strony.",
      title: "Nie znaleziono strony",
      body: "Link może być nieaktualny albo strona została przeniesiona.",
      cta: "Przejdź do strony głównej",
    },
    download: {
      metaTitle: "Pobierz plik",
      loadingTitle: "Przygotowujemy pobieranie",
      loadingBody: "Zwykle zajmuje to kilka sekund.",
      readyTitle: "Pobieranie jest gotowe",
      readyBody: "Dziękujemy za zamówienie. Bezpieczne linki powinny uruchomić się automatycznie.",
      fallbackBody: "Jeśli pobieranie nie rozpocznie się automatycznie, użyj bezpiecznych przycisków poniżej.",
      emailTitle: "Sprawdź e-mail",
      emailBody: "Wysłaliśmy też bezpieczne linki do pobrania na Twój e-mail.",
      deliveryPolicyNote: "Linki są aktywne przez {hours} godzin i pozwalają na maksymalnie {maxDownloads} pobrań.",
      orderReferenceLabel: "Numer referencyjny zamówienia",
      downloadsUsed: "Wykorzystano {used} z {total} pobrań",
      blockedTitle: "Niektóre pliki wymagają ręcznego ponownego wysłania.",
      blockedSupportBody: "Jeśli nadal potrzebujesz pliku po osiągnięciu limitu, skontaktuj się z pomocą.",
      manualResendTitle: "Wymagane ręczne ponowne wysłanie",
      manualResendSupportBody: "Skontaktuj się z pomocą, a pomożemy w ręcznym ponownym wysłaniu.",
      errorTitle: "Nie możemy jeszcze przygotować pobierania",
      errorBody: "Jeśli płatność przeszła, nie martw się. Możemy ponownie wysłać nowe bezpieczne linki na e-mail.",
      errorSupportBody: "Jeśli problem nie ustąpi, skontaktuj się z pomocą.",
    },
    legal: {
      englishNoticeTitle: "Wersja angielska",
      englishNoticeBody: "Ten dokument jest udostępniony w języku angielskim. Tłumaczenia mają wyłącznie charakter pomocniczy.",
      lastUpdatedLabel: "Ostatnia aktualizacja",
    },
    privacy: {
      metaTitle: "Polityka prywatności",
      metaDescription: "Jak zbieramy, wykorzystujemy i chronimy Twoje dane.",
      title: "Polityka prywatności",
    },
    terms: {
      metaTitle: "Warunki korzystania",
      metaDescription: "Zasady korzystania z tej strony i jej usług.",
      title: "Warunki korzystania",
    },
  },
  hi: {
    common: { backHome: "होम पर वापस जाएं" },
    notFound: {
      metaTitle: "पेज नहीं मिला",
      metaDescription: "मांगा गया पेज नहीं मिला।",
      title: "पेज नहीं मिला",
      body: "लिंक गलत हो सकता है या पेज हटा दिया गया है।",
      cta: "होम पर जाएं",
    },
    download: {
      metaTitle: "अपनी फ़ाइल डाउनलोड करें",
      loadingTitle: "डाउनलोड तैयार किया जा रहा है",
      loadingBody: "इसमें आमतौर पर कुछ सेकंड लगते हैं।",
      readyTitle: "आपका डाउनलोड तैयार है",
      readyBody: "आपके ऑर्डर के लिए धन्यवाद। आपके सुरक्षित लिंक अपने-आप शुरू हो जाने चाहिए।",
      fallbackBody: "अगर डाउनलोड अपने-आप शुरू न हो, तो नीचे दिए गए सुरक्षित बटन इस्तेमाल करें।",
      emailTitle: "अपना ईमेल देखें",
      emailBody: "हमने सुरक्षित डाउनलोड लिंक आपके ईमेल पर भी भेज दिए हैं।",
      deliveryPolicyNote: "लिंक {hours} घंटे तक सक्रिय रहते हैं और अधिकतम {maxDownloads} डाउनलोड की अनुमति देते हैं।",
      orderReferenceLabel: "ऑर्डर रेफरेंस",
      downloadsUsed: "{total} में से {used} डाउनलोड इस्तेमाल हो चुके हैं",
      blockedTitle: "कुछ फ़ाइलों के लिए मैनुअल रीसेन्ड चाहिए।",
      blockedSupportBody: "अगर सीमा पूरी होने के बाद भी आपको फ़ाइल चाहिए, तो सहायता टीम से संपर्क करें।",
      manualResendTitle: "मैनुअल रीसेन्ड आवश्यक है",
      manualResendSupportBody: "सहायता टीम से संपर्क करें, हम मैनुअल रीसेन्ड में मदद करेंगे।",
      errorTitle: "हम अभी आपका डाउनलोड तैयार नहीं कर सके",
      errorBody: "अगर आपका भुगतान हो गया है, तो चिंता न करें। हम ईमेल पर नए सुरक्षित डाउनलोड लिंक फिर भेज सकते हैं।",
      errorSupportBody: "अगर समस्या बनी रहे, तो सहायता टीम से संपर्क करें।",
    },
    legal: {
      englishNoticeTitle: "अंग्रेज़ी संस्करण",
      englishNoticeBody: "यह दस्तावेज़ अंग्रेज़ी में उपलब्ध कराया गया है। अनुवाद केवल सुविधा के लिए हैं।",
      lastUpdatedLabel: "आख़िरी अपडेट",
    },
    privacy: {
      metaTitle: "गोपनीयता नीति",
      metaDescription: "हम आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित रखते हैं।",
      title: "गोपनीयता नीति",
    },
    terms: {
      metaTitle: "सेवा की शर्तें",
      metaDescription: "इस साइट और इसकी सेवाओं के उपयोग पर लागू शर्तें।",
      title: "सेवा की शर्तें",
    },
  },
  uk: {
    common: { backHome: "Назад на головну" },
    notFound: {
      metaTitle: "Сторінку не знайдено",
      metaDescription: "Запитану сторінку не знайдено.",
      title: "Сторінку не знайдено",
      body: "Посилання може бути недійсним або сторінку перенесено.",
      cta: "На головну",
    },
    download: {
      metaTitle: "Завантажити файл",
      loadingTitle: "Готуємо завантаження",
      loadingBody: "Зазвичай це триває кілька секунд.",
      readyTitle: "Ваше завантаження готове",
      readyBody: "Дякуємо за замовлення. Ваші безпечні посилання мають почати завантаження автоматично.",
      fallbackBody: "Якщо завантаження не починається автоматично, скористайтеся безпечними кнопками нижче.",
      emailTitle: "Перевірте електронну пошту",
      emailBody: "Ми також надіслали безпечні посилання для завантаження на вашу електронну пошту.",
      deliveryPolicyNote: "Посилання активні {hours} годин і дозволяють до {maxDownloads} завантажень.",
      orderReferenceLabel: "Номер замовлення",
      downloadsUsed: "Використано {used} із {total} завантажень",
      blockedTitle: "Деякі файли потребують ручного повторного надсилання.",
      blockedSupportBody: "Якщо файл усе ще потрібен після ліміту, зверніться до підтримки.",
      manualResendTitle: "Потрібне ручне повторне надсилання",
      manualResendSupportBody: "Зверніться до підтримки, і ми допоможемо з ручним повторним надсиланням.",
      errorTitle: "Ми ще не можемо підготувати ваше завантаження",
      errorBody: "Якщо платіж пройшов, не хвилюйтеся. Ми можемо повторно надіслати нові безпечні посилання на електронну пошту.",
      errorSupportBody: "Якщо проблема не зникне, зверніться до підтримки.",
    },
    legal: {
      englishNoticeTitle: "Англійська версія",
      englishNoticeBody: "Цей документ надано англійською мовою. Переклади подано лише для зручності.",
      lastUpdatedLabel: "Останнє оновлення",
    },
    privacy: {
      metaTitle: "Політика конфіденційності",
      metaDescription: "Як ми збираємо, використовуємо й захищаємо вашу інформацію.",
      title: "Політика конфіденційності",
    },
    terms: {
      metaTitle: "Умови використання",
      metaDescription: "Умови використання цього сайту та його сервісів.",
      title: "Умови використання",
    },
  },
  ru: {
    common: { backHome: "Назад на главную" },
    notFound: {
      metaTitle: "Страница не найдена",
      metaDescription: "Запрошенная страница не найдена.",
      title: "Страница не найдена",
      body: "Ссылка может быть неверной или страница была перемещена.",
      cta: "На главную",
    },
    download: {
      metaTitle: "Скачать файл",
      loadingTitle: "Подготавливаем загрузку",
      loadingBody: "Обычно это занимает несколько секунд.",
      readyTitle: "Файл готов к загрузке",
      readyBody: "Спасибо за ваш заказ. Ваши защищённые ссылки должны начать загрузку автоматически.",
      fallbackBody: "Если загрузка не началась автоматически, используйте безопасные кнопки ниже.",
      emailTitle: "Проверьте почту",
      emailBody: "Мы также отправили защищённые ссылки для скачивания на вашу почту.",
      deliveryPolicyNote: "Ссылка действует {hours} часов и позволяет скачать файл до {maxDownloads} раз.",
      orderReferenceLabel: "Номер заказа",
      downloadsUsed: "Использовано {used} из {total} загрузок",
      blockedTitle: "Для некоторых файлов нужна ручная повторная отправка.",
      blockedSupportBody: "Если файл всё ещё нужен после исчерпания лимита, свяжитесь с поддержкой.",
      manualResendTitle: "Требуется ручная повторная отправка",
      manualResendSupportBody: "Свяжитесь с поддержкой, и мы поможем с ручной повторной отправкой.",
      errorTitle: "Мы пока не смогли подготовить вашу загрузку",
      errorBody: "Если платёж прошёл, не переживайте. Мы можем повторно отправить новые защищённые ссылки на почту.",
      errorSupportBody: "Если проблема повторится, свяжитесь с поддержкой.",
    },
    legal: {
      englishNoticeTitle: "Английская версия",
      englishNoticeBody: "Этот документ предоставлен на английском языке. Переводы даны только для удобства.",
      lastUpdatedLabel: "Последнее обновление",
    },
    privacy: {
      metaTitle: "Политика конфиденциальности",
      metaDescription: "Как мы собираем, используем и защищаем ваши данные.",
      title: "Политика конфиденциальности",
    },
    terms: {
      metaTitle: "Условия использования",
      metaDescription: "Условия, применимые к использованию сайта и его сервисов.",
      title: "Условия использования",
    },
  },
};

export function formatSiteText(template: string, vars?: Record<string, string | number>): string {
  if (!vars) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = vars[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}