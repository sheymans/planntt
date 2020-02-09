#!/usr/bin/env perl
#===============================================================================
#
#         FILE: slurp_log.pl
#
#        USAGE: ./slurp_log.pl
#
#  DESCRIPTION:
#
#      OPTIONS: ---
# REQUIREMENTS: ---
#         BUGS: ---
#        NOTES: ---
#       AUTHOR: YOUR NAME (),
# ORGANIZATION:
#      VERSION: 1.0
#      CREATED: 02/06/2020 12:29:11
#     REVISION: ---
#===============================================================================

use strict;
use warnings;
use utf8;

use File::Slurp qw(read_file write_file append_file);
use DateTime::Format::Flexible;
use Text::CSV qw(csv);

if (scalar @ARGV == 0) {
    print "Needs a file to convert.\n";
}

my $file_name = $ARGV[0];

my $file_name_csv = $file_name . ".csv";
my @file_content = read_file($file_name);
my $csv = Text::CSV->new({ binary => 1, auto_diag => 1 });
open my $fh, ">:encoding(utf8)", $file_name_csv or die "$file_name_csv: $!";

my $short_date = "";
my $current_row = [];
my $content = "";

$csv->say($fh, [ 'Date', 'Note', 'Name' ]);
foreach my $line (@file_content) {
    if ($line =~ /^\# (.*)/) {
        # Drop the lines # January 2019 etc
    }
    elsif ($line =~ /^\#\# (.*)/) {
        # we found a date, finish up the previous entry
        push @$current_row, $content;
        my $name = "Tech Management Partnership updates of $short_date";
        push @$current_row, $name;
        $csv->say($fh, $current_row);

        # reset
        my $line_match = $1;
        print "$line_match\n";
        my $date = DateTime::Format::Flexible->parse_datetime($line_match);
        $short_date = substr($date, 0, 10);
        $current_row = [ $short_date ];
        $content = "";
    }
    else {
        $content = $content . $line;
    }
}
