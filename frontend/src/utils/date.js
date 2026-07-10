export function toDateTimeLocal(value) {

    if (!value) {
        return '';
    }

    const date = new Date(value);

    const offset = date.getTimezoneOffset();

    const localDate = new Date(
        date.getTime() - offset * 60000
    );

    return localDate
        .toISOString()
        .slice(0, 16);

}

export function fromDateTimeLocal(value) {

    if (!value) {
        return null;
    }

    return new Date(value).toISOString();

}

export function formatEpisodeDate(value) {

    if (!value) {
        return '';
    }

    return new Intl.DateTimeFormat('ro-RO', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));

}