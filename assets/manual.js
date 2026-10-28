/* Manual de ventas de Near Me Best Work (borrador para validar con David).
   Lo usa la persona que atiende un lead cuando no lo está haciendo el asistente de WhatsApp.
   Los guiones van en inglés y en español porque la mayoría de clientes escribe en inglés. */
window.SALES_MANUAL = [
  {
    id: 'principios', title: 'Cómo vendemos', icon: '★',
    intro: 'Cinco reglas que aplican a cualquier lead, venga de WhatsApp, la web, una llamada, Thumbtack o un walk-in.',
    points: [
      ['Responder en menos de 5 minutos', 'El primero que responde suele quedarse con el trabajo. Si no puedes atender, el asistente lo hace por ti.'],
      ['Todo queda en el CRM', 'Cada mensaje, cotización y llamada se registra en la ficha del lead. Nada por fuera.'],
      ['Mostrar antes de vender', 'Envía fotos de antes y después de un trabajo parecido. Venden más que cualquier descripción.'],
      ['Ofrecer la membresía siempre', 'Al cotizar y, sobre todo, al terminar cada trabajo, cuando el cliente está más contento.'],
      ['Best Work Promise', 'Si el cliente no queda contento, volvemos y lo corregimos. Úsalo para dar confianza, no como descuento.'],
    ],
  },
  {
    id: 'contacto', title: 'Primer contacto', icon: '👋',
    intro: 'Saluda, preséntate y pide lo necesario para cotizar: servicio, dirección y fotos.',
    points: [
      ['Pide la dirección', 'Con la dirección se saca el tamaño de la casa del registro del condado. El cliente no tiene que medir nada.'],
      ['Pide 2 o 3 fotos', 'Del área a limpiar. Permiten cotizar sin visita en la mayoría de casos.'],
      ['Usa el idioma del cliente', 'Si escribe en español, responde en español. Hablamos español es una ventaja.'],
    ],
    scripts: [
      ['Saludo por WhatsApp', "Hi {nombre}! This is {tu nombre} from Near Me Best Work. Thanks for reaching out. Could you send me the address and a couple of photos of the area? I'll get you a price today.", '¡Hola {nombre}! Le saluda {tu nombre} de Near Me Best Work. Gracias por escribirnos. ¿Me envía la dirección y un par de fotos del área? Hoy mismo le paso el precio.'],
      ['Walk-in (en la obra)', "Happy to help! I'll text you a quote today. What's the best number and address?", '¡Con gusto! Hoy le envío la cotización por WhatsApp. ¿A qué número y en qué dirección?'],
    ],
  },
  {
    id: 'calificar', title: 'Las 5 preguntas', icon: '🎯',
    intro: 'Son las mismas que hace el asistente. Las respuestas dicen qué tan probable es cerrar y qué tan urgente es. Hazlas en conversación, no como formulario.',
    questions: true,
    points: [
      ['70% o más', 'Lead caliente: llama hoy y cierra con fecha en la agenda.'],
      ['Entre 40% y 69%', 'Envía la cotización hoy y sigue la cadencia de seguimiento.'],
      ['Menos de 40%', 'Cotiza, deja la puerta abierta y ofrece la membresía para más adelante.'],
    ],
  },
  {
    id: 'cotizar', title: 'Cotizar', icon: '$',
    intro: 'Precios publicados y reglas para que cualquiera cotice igual que David.',
    points: [
      ['House Soft Wash', '$249'], ['Driveway, sidewalk y entrada', '$99'], ['Roof Soft Wash', '$349, o $0.25 por pie² de techo en casas grandes'],
      ['Pool deck o patio', '$149'], ['Paver Sealing', '$299'], ['Fence Cleaning', '$149'], ['Screen enclosure / pool cage', 'Desde $400'],
      ['Membresía', 'Base desde $29/mes, Gold desde $59/mes, Platinum desde $99/mes según la banda S, M o L'],
    ],
    scripts: [
      ['Envío de cotización', "Hi {nombre}, here's your quote: {servicios} for {valor}. We can do it as soon as {fecha}. Fully insured, and if you're not happy, we come back and fix it. Want me to book it?", 'Hola {nombre}, esta es su cotización: {servicios} por {valor}. Podemos hacerlo desde el {fecha}. Estamos asegurados y, si no queda contento, volvemos y lo corregimos. ¿Se lo agendo?'],
    ],
  },
  {
    id: 'upselling', title: 'Venta adicional', icon: '➕',
    intro: 'Combinaciones que el cliente casi siempre acepta si se las ofreces en el momento correcto.',
    points: [
      ['Casa + driveway', 'Si pide la casa, ofrece el driveway: "ya que estamos ahí, queda todo parejo".'],
      ['Techo', 'En cada visita hay inspección gratis del techo: si tiene manchas negras, muéstrale la foto y cotiza el Roof Soft Wash.'],
      ['Sellado de pavers', 'Justo después de limpiar los pavers es el mejor momento para sellarlos.'],
      ['Membresía Gold', 'Al terminar el trabajo: "su casa puede quedar así todo el año por $69 al mes, techo incluido".'],
    ],
    scripts: [
      ['Membresía al terminar', "Your home looks amazing! You can keep it like this all year for ${precio}/month. House, driveway and roof included, and we schedule everything for you.", '¡Su casa quedó increíble! Puede mantenerla así todo el año por ${precio} al mes. Casa, driveway y techo incluidos, y nosotros agendamos todo.'],
    ],
  },
  {
    id: 'objeciones', title: 'Objeciones', icon: '💬',
    intro: 'Las cinco que más se escuchan y cómo responderlas sin bajar el precio.',
    objections: [
      ['Está caro', 'Explica qué incluye: soft wash que no daña, seguro, garantía. Ofrece quitar un servicio antes que bajar el precio.', "I get it. Our price includes a soft wash that won't damage your roof or paint, full insurance and the Best Work Promise. If it helps, we can start with just the {servicio} and add the rest later.", 'Lo entiendo. El precio incluye un lavado suave que no daña el techo ni la pintura, seguro completo y nuestra garantía. Si le ayuda, empezamos solo con {servicio} y el resto lo hacemos después.'],
      ['Tengo una cotización más barata', 'No compitas por precio: compara qué incluye la otra y muestra reseñas y fotos.', 'Totally fair to compare. Just check if they use soft wash for the roof, are insured, and will come back if something is missed. We have 343 five-star reviews; happy to send you some before and afters.', 'Es justo comparar. Solo revise si usan lavado suave en el techo, si tienen seguro y si vuelven cuando algo queda mal. Tenemos 343 reseñas de cinco estrellas; con gusto le envío fotos de antes y después.'],
      ['Lo voy a pensar', 'Pregunta qué le falta para decidir y deja una fecha tentativa.', 'Of course. Is there anything I can clear up? I can pencil you in for {fecha} with no commitment, so you keep the spot.', 'Claro. ¿Hay algo que le pueda aclarar? Le puedo apartar el {fecha} sin compromiso para que no pierda el cupo.'],
      ['Lo consulto con mi pareja', 'Envía la cotización con fotos para que la pueda compartir y agenda un seguimiento.', "Sure! I'll send you the quote with photos so you can share it. I'll check back tomorrow.", '¡Claro! Le envío la cotización con fotos para que la comparta. Mañana le escribo para ver qué decidieron.'],
      ['¿Para qué una membresía?', 'Habla de tranquilidad y de ahorro, no del contrato.', "You won't have to call anyone again: we schedule everything and you save up to $343 a year versus booking each service.", 'No vuelve a tener que llamar a nadie: nosotros agendamos todo y ahorra hasta $343 al año frente a pedir cada servicio por separado.'],
    ],
  },
  {
    id: 'seguimiento', title: 'Seguimiento', icon: '🔁',
    intro: 'Cadencia para cotizaciones sin respuesta. Cada paso queda como tarea en el CRM.',
    points: [
      ['Día 0', 'Envía la cotización con fotos de un trabajo parecido.'],
      ['Día 1', 'Pregunta si tiene dudas y ofrece una fecha concreta.'],
      ['Día 3', 'Envía una reseña o un antes y después de su zona.'],
      ['Día 7', 'Último mensaje amable; si no responde, el lead pasa a Perdido con el motivo.'],
    ],
    scripts: [
      ['Día 1', "Hi {nombre}, just checking if you had any questions about the quote. I have an opening on {fecha}, want me to save it for you?", 'Hola {nombre}, ¿le quedó alguna duda de la cotización? Tengo cupo el {fecha}, ¿se lo aparto?'],
    ],
  },
  {
    id: 'cierre', title: 'Cierre y agenda', icon: '📅',
    intro: 'Cuando dice que sí, conviértelo en cliente y agéndalo en el CRM para que le llegue al técnico.',
    points: [
      ['Confirma', 'Fecha, hora aproximada, dirección y servicios.'],
      ['Pregunta por el acceso', 'Portón, llave de agua exterior, mascotas, carros en el driveway.'],
      ['Agenda en la plataforma', 'Botón "Convertir en cliente y agendar trabajo": el técnico lo ve en su app.'],
      ['Envía la confirmación', 'Por WhatsApp, con el día y lo que debe dejar listo.'],
    ],
  },
  {
    id: 'despues', title: 'Después del trabajo', icon: '⭐',
    intro: 'El mejor momento para vender otra vez es cuando el cliente ve el resultado.',
    points: [
      ['Fotos de antes y después', 'Envíalas el mismo día. También alimentan las redes y la web.'],
      ['Pide la reseña', 'Con el QR de Google o el enlace directo, en el momento.'],
      ['Ofrece la membresía', 'Con el guion de venta adicional.'],
      ['Pide referidos', 'Los referidos cierran más que cualquier otro origen.'],
    ],
  },
];
